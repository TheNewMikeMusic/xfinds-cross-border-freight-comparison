const fs = require('fs');
const path = require('path');

/**
 * 更新products.json中所有图片路径为webp格式
 */

const productsFile = path.join(__dirname, '..', 'data', 'products.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

console.log('🔄 更新图片路径为webp格式...\n');

// 读取产品数据
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// 获取所有webp文件
const webpFiles = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.webp'))
  .map(file => file.toLowerCase());

console.log(`找到 ${webpFiles.length} 个webp文件\n`);

let updatedCount = 0;
let notFoundCount = 0;
const notFoundFiles = [];

// 更新产品图片路径
products.forEach((product, idx) => {
  let changed = false;
  
  // 更新cover路径
  if (product.cover) {
    const oldPath = product.cover;
    const filename = path.basename(oldPath);
    const webpFilename = filename.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp').toLowerCase();
    const newPath = `/images/${webpFilename}`;
    
    // 检查webp文件是否存在
    if (webpFiles.includes(webpFilename)) {
      product.cover = newPath;
      changed = true;
      console.log(`✅ ${product.id} cover: ${oldPath} -> ${newPath}`);
    } else {
      notFoundFiles.push({ productId: product.id, type: 'cover', path: oldPath, expected: webpFilename });
      console.log(`⚠️  ${product.id} cover: webp文件不存在 - ${webpFilename}`);
    }
  }
  
  // 更新gallery路径
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((img, galleryIdx) => {
      const oldPath = img;
      const filename = path.basename(oldPath);
      const webpFilename = filename.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp').toLowerCase();
      const newPath = `/images/${webpFilename}`;
      
      // 检查webp文件是否存在
      if (webpFiles.includes(webpFilename)) {
        product.gallery[galleryIdx] = newPath;
        changed = true;
        console.log(`✅ ${product.id} gallery[${galleryIdx}]: ${oldPath} -> ${newPath}`);
      } else {
        notFoundFiles.push({ productId: product.id, type: `gallery[${galleryIdx}]`, path: oldPath, expected: webpFilename });
        console.log(`⚠️  ${product.id} gallery[${galleryIdx}]: webp文件不存在 - ${webpFilename}`);
      }
    });
  }
  
  if (changed) {
    updatedCount++;
  }
});

// 保存更新后的products.json
fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');

console.log(`\n✅ 完成！`);
console.log(`   - 更新产品: ${updatedCount} 个`);
console.log(`   - 未找到webp文件: ${notFoundCount} 个`);

if (notFoundFiles.length > 0) {
  console.log(`\n⚠️  未找到的webp文件列表:`);
  notFoundFiles.forEach(item => {
    console.log(`   - ${item.productId} [${item.type}]: 期望 ${item.expected}`);
  });
  console.log(`\n💡 提示: 请检查这些文件是否已转换为webp格式`);
}

// 验证JSON格式
try {
  JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  console.log(`\n✅ products.json 格式验证通过`);
} catch (error) {
  console.error(`\n❌ products.json 格式错误:`, error.message);
  process.exit(1);
}


