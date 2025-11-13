const fs = require('fs');
const path = require('path');

/**
 * 修复图片问题并统一移动到images目录
 */

const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');
const productsFile = path.join(__dirname, '..', 'data', 'products.json');

console.log('🔧 开始修复图片问题...\n');

// 1. 确保images目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ 创建 images 目录');
}

// 2. 读取产品数据
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// 3. 需要保留在根目录的特殊文件
const keepInRoot = [
  'icon.svg',
  'Xfinds logo.png',
  'robots.txt'
];

// 4. 需要保留的目录
const keepDirs = [
  'agent logo',
  'agents',
  'hero',
  'uploads'
];

// 5. 文件移动映射
const fileMoves = new Map();
const pathUpdates = [];

// 6. 处理所有图片文件
function processDirectory(dir, basePath = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name).replace(/\\/g, '/');
    
    if (item.isDirectory()) {
      // 跳过需要保留的目录
      if (!keepDirs.includes(item.name)) {
        processDirectory(fullPath, relativePath);
      }
    } else {
      // 跳过需要保留在根目录的文件
      if (keepInRoot.includes(item.name)) {
        continue;
      }
      
      // 只处理图片文件
      if (/\.(png|jpg|jpeg|gif|webp)$/i.test(item.name)) {
        // 生成新文件名（去掉空格，转小写）
        let newName = item.name
          .replace(/\s+/g, '-')  // 空格替换为连字符
          .toLowerCase();        // 转小写
        
        // 如果已经在images目录，检查是否需要重命名
        if (basePath === 'images' || basePath === '') {
          const oldPath = basePath ? `/${relativePath}` : `/${item.name}`;
          const newPath = `/images/${newName}`;
          
          if (oldPath !== newPath) {
            fileMoves.set(fullPath, {
              oldPath: oldPath,
              newPath: newPath,
              newFullPath: path.join(imagesDir, newName)
            });
          }
        } else {
          // 从子目录移动到images目录
          const oldPath = `/${relativePath}`;
          const newPath = `/images/${newName}`;
          
          fileMoves.set(fullPath, {
            oldPath: oldPath,
            newPath: newPath,
            newFullPath: path.join(imagesDir, newName)
          });
        }
      }
    }
  }
}

// 7. 扫描public目录
console.log('📂 扫描图片文件...');
processDirectory(publicDir);

// 8. 处理文件移动
console.log(`\n📦 准备移动 ${fileMoves.size} 个文件到 images 目录...`);

let movedCount = 0;
let skippedCount = 0;

for (const [oldFullPath, moveInfo] of fileMoves.entries()) {
  try {
    // 如果目标文件已存在，跳过
    if (fs.existsSync(moveInfo.newFullPath)) {
      console.log(`⏭️  跳过（已存在）: ${moveInfo.oldPath} -> ${moveInfo.newPath}`);
      skippedCount++;
      continue;
    }
    
    // 移动文件
    fs.copyFileSync(oldFullPath, moveInfo.newFullPath);
    
    // 如果不在images目录，删除原文件
    if (!oldFullPath.includes('images')) {
      fs.unlinkSync(oldFullPath);
    }
    
    console.log(`✅ 移动: ${moveInfo.oldPath} -> ${moveInfo.newPath}`);
    movedCount++;
    
    // 记录路径更新
    pathUpdates.push({
      old: moveInfo.oldPath,
      new: moveInfo.newPath
    });
  } catch (error) {
    console.error(`❌ 错误移动 ${moveInfo.oldPath}:`, error.message);
  }
}

// 9. 更新products.json中的路径
console.log('\n📝 更新 products.json 中的图片路径...');

let updatedCount = 0;

products.forEach(product => {
  let changed = false;
  
  // 更新cover路径
  if (product.cover) {
    const update = pathUpdates.find(u => 
      product.cover === u.old || 
      product.cover.toLowerCase() === u.old.toLowerCase() ||
      product.cover.replace(/\s+/g, '-').toLowerCase() === u.old.replace(/\s+/g, '-').toLowerCase()
    );
    
    if (update) {
      product.cover = update.new;
      changed = true;
    } else if (!product.cover.startsWith('/images/') && 
               !product.cover.startsWith('/agent') &&
               !product.cover.startsWith('/icon') &&
               !product.cover.includes('Xfinds')) {
      // 如果路径不在images目录，尝试查找对应的新路径
      const filename = path.basename(product.cover).replace(/\s+/g, '-').toLowerCase();
      const newPath = `/images/${filename}`;
      const updateMatch = pathUpdates.find(u => u.new === newPath);
      if (updateMatch) {
        product.cover = newPath;
        changed = true;
      }
    }
  }
  
  // 更新gallery路径
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((img, idx) => {
      const update = pathUpdates.find(u => 
        img === u.old || 
        img.toLowerCase() === u.old.toLowerCase() ||
        img.replace(/\s+/g, '-').toLowerCase() === u.old.replace(/\s+/g, '-').toLowerCase()
      );
      
      if (update) {
        product.gallery[idx] = update.new;
        changed = true;
      } else if (!img.startsWith('/images/') && 
                 !img.startsWith('/agent') &&
                 !img.startsWith('/icon') &&
                 !img.includes('Xfinds')) {
        const filename = path.basename(img).replace(/\s+/g, '-').toLowerCase();
        const newPath = `/images/${filename}`;
        const updateMatch = pathUpdates.find(u => u.new === newPath);
        if (updateMatch) {
          product.gallery[idx] = newPath;
          changed = true;
        }
      }
    });
  }
  
  if (changed) {
    updatedCount++;
  }
});

// 10. 保存更新后的products.json
fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');

console.log(`\n✅ 完成！`);
console.log(`   - 移动文件: ${movedCount} 个`);
console.log(`   - 跳过文件: ${skippedCount} 个`);
console.log(`   - 更新产品: ${updatedCount} 个`);
console.log(`   - 路径更新: ${pathUpdates.length} 个`);

// 11. 验证JSON格式
try {
  JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  console.log(`\n✅ products.json 格式验证通过`);
} catch (error) {
  console.error(`\n❌ products.json 格式错误:`, error.message);
  process.exit(1);
}


