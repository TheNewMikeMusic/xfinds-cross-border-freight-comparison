const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.json');
const publicDir = path.join(__dirname, '..', 'public');

const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

console.log('🔍 验证所有图片路径...\n');

let allPaths = [];
products.forEach(product => {
  if (product.cover) allPaths.push(product.cover);
  if (product.gallery) allPaths.push(...product.gallery);
});

// 统计路径类型
const imagesPaths = allPaths.filter(p => p.startsWith('/images/'));
const agentPaths = allPaths.filter(p => p.startsWith('/agent'));
const iconPaths = allPaths.filter(p => p.startsWith('/icon'));
const otherPaths = allPaths.filter(p => 
  !p.startsWith('/images/') && 
  !p.startsWith('/agent') && 
  !p.startsWith('/icon') &&
  !p.includes('Xfinds')
);

console.log(`📊 路径统计:`);
console.log(`   - /images/ 路径: ${imagesPaths.length} 个`);
console.log(`   - /agent 路径: ${agentPaths.length} 个`);
console.log(`   - /icon 路径: ${iconPaths.length} 个`);
console.log(`   - 其他路径: ${otherPaths.length} 个`);

if (otherPaths.length > 0) {
  console.log(`\n⚠️  其他路径列表:`);
  otherPaths.forEach(p => console.log(`   - ${p}`));
} else {
  console.log(`\n✅ 所有商品图片路径都已统一到 /images/ 目录！`);
}

// 检查文件是否存在
console.log(`\n🔍 检查文件存在性...`);
let missingFiles = [];

allPaths.forEach(imgPath => {
  if (imgPath.startsWith('/images/') || imgPath.startsWith('/agent') || imgPath.startsWith('/icon')) {
    const filePath = path.join(publicDir, imgPath);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(imgPath);
    }
  }
});

if (missingFiles.length > 0) {
  console.log(`\n❌ 缺失的文件 (${missingFiles.length}个):`);
  missingFiles.forEach(f => console.log(`   - ${f}`));
} else {
  console.log(`\n✅ 所有图片文件都存在！`);
}

console.log(`\n✅ 验证完成！`);


