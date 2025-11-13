const fs = require('fs');
const path = require('path');

/**
 * 移动剩余的图片文件到images目录
 */

const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');

// 需要保留在根目录的文件
const keepInRoot = [
  'Xfinds logo.png'
];

console.log('🔧 移动剩余的图片文件到 images 目录...\n');

// 获取public根目录下的所有PNG文件
const files = fs.readdirSync(publicDir)
  .filter(file => {
    const fullPath = path.join(publicDir, file);
    return fs.statSync(fullPath).isFile() && 
           /\.(png|jpg|jpeg|gif|webp)$/i.test(file) &&
           !keepInRoot.includes(file);
  });

console.log(`找到 ${files.length} 个需要移动的文件\n`);

let movedCount = 0;
let skippedCount = 0;

files.forEach(file => {
  const oldPath = path.join(publicDir, file);
  const newName = file.toLowerCase().replace(/\s+/g, '-');
  const newPath = path.join(imagesDir, newName);
  
  try {
    // 如果目标文件已存在，跳过
    if (fs.existsSync(newPath)) {
      console.log(`⏭️  跳过（已存在）: ${file} -> images/${newName}`);
      skippedCount++;
      
      // 如果原文件和新文件相同，删除原文件
      if (file.toLowerCase().replace(/\s+/g, '-') === newName) {
        fs.unlinkSync(oldPath);
        console.log(`   ✅ 删除重复文件: ${file}`);
      }
      return;
    }
    
    // 移动文件
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);
    
    console.log(`✅ 移动: ${file} -> images/${newName}`);
    movedCount++;
  } catch (error) {
    console.error(`❌ 错误处理 ${file}:`, error.message);
  }
});

console.log(`\n✅ 完成！`);
console.log(`   - 移动文件: ${movedCount} 个`);
console.log(`   - 跳过文件: ${skippedCount} 个`);


