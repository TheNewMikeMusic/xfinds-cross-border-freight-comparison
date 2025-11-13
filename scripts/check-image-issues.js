const fs = require('fs');
const path = require('path');

/**
 * 全面检查可能导致破图的问题
 */

const publicDir = path.join(__dirname, '..', 'public');
const productsFile = path.join(__dirname, '..', 'data', 'products.json');

console.log('🔍 开始检查图片问题...\n');

// 1. 读取所有产品数据
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// 2. 获取public目录下所有图片文件
function getAllImageFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name).replace(/\\/g, '/');
    
    if (item.isDirectory()) {
      files.push(...getAllImageFiles(fullPath, relativePath));
    } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(item.name)) {
      files.push({
        path: relativePath.startsWith('/') ? relativePath : '/' + relativePath,
        fullPath: fullPath,
        name: item.name
      });
    }
  }
  
  return files;
}

const allImages = getAllImageFiles(publicDir);
const imageMap = new Map();
allImages.forEach(img => {
  imageMap.set(img.path.toLowerCase(), img);
});

// 3. 检查问题
const issues = {
  missingFiles: [],
  pathInconsistency: [],
  spacesInFilename: [],
  chineseInFilename: [],
  caseSensitivity: [],
  pathMismatch: []
};

products.forEach(product => {
  // 检查cover图片
  if (product.cover) {
    checkImage(product.cover, product.id, 'cover');
  }
  
  // 检查gallery图片
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((img, idx) => {
      checkImage(img, product.id, `gallery[${idx}]`);
    });
  }
});

function checkImage(imagePath, productId, type) {
  // 1. 检查文件是否存在
  const normalizedPath = imagePath.toLowerCase();
  const fileExists = imageMap.has(normalizedPath);
  
  if (!fileExists) {
    // 尝试查找大小写不同的文件
    let foundCaseVariant = false;
    for (const [key, value] of imageMap.entries()) {
      if (key.replace(/[\/\\]/g, '').toLowerCase() === normalizedPath.replace(/[\/\\]/g, '').toLowerCase()) {
        foundCaseVariant = true;
        issues.caseSensitivity.push({
          productId,
          type,
          expected: imagePath,
          actual: value.path,
          issue: '大小写不匹配'
        });
        break;
      }
    }
    
    if (!foundCaseVariant) {
      issues.missingFiles.push({
        productId,
        type,
        path: imagePath,
        issue: '文件不存在'
      });
    }
  }
  
  // 2. 检查路径一致性（是否应该使用/images/前缀）
  const shouldUseImages = !imagePath.startsWith('/images/') && 
                          !imagePath.startsWith('/agent') &&
                          !imagePath.startsWith('/icon') &&
                          !imagePath.startsWith('/Xfinds');
  
  if (shouldUseImages && !imagePath.includes('JQ0006') && !imagePath.includes('Nasa')) {
    issues.pathInconsistency.push({
      productId,
      type,
      path: imagePath,
      suggestion: imagePath.replace(/^\//, '/images/'),
      issue: '建议使用/images/前缀以保持一致性'
    });
  }
  
  // 3. 检查文件名中的空格
  const filename = path.basename(imagePath);
  if (filename.includes(' ')) {
    issues.spacesInFilename.push({
      productId,
      type,
      path: imagePath,
      issue: '文件名包含空格，可能导致URL编码问题'
    });
  }
  
  // 4. 检查中文文件名
  if (/[\u4e00-\u9fa5]/.test(filename)) {
    issues.chineseInFilename.push({
      productId,
      type,
      path: imagePath,
      issue: '文件名包含中文，可能导致编码问题'
    });
  }
  
  // 5. 检查实际文件路径与引用路径是否匹配
  if (fileExists) {
    const actualFile = imageMap.get(normalizedPath);
    if (actualFile.path !== imagePath) {
      issues.pathMismatch.push({
        productId,
        type,
        expected: imagePath,
        actual: actualFile.path,
        issue: '路径不匹配（可能是大小写问题）'
      });
    }
  }
}

// 4. 输出报告
console.log('📊 检查结果报告\n');
console.log('='.repeat(60));

if (issues.missingFiles.length > 0) {
  console.log(`\n❌ 缺失的文件 (${issues.missingFiles.length}个):`);
  issues.missingFiles.forEach(issue => {
    console.log(`  - ${issue.productId} [${issue.type}]: ${issue.path}`);
  });
}

if (issues.caseSensitivity.length > 0) {
  console.log(`\n⚠️  大小写敏感问题 (${issues.caseSensitivity.length}个):`);
  issues.caseSensitivity.forEach(issue => {
    console.log(`  - ${issue.productId} [${issue.type}]:`);
    console.log(`    期望: ${issue.expected}`);
    console.log(`    实际: ${issue.actual}`);
  });
}

if (issues.spacesInFilename.length > 0) {
  console.log(`\n⚠️  文件名包含空格 (${issues.spacesInFilename.length}个):`);
  issues.spacesInFilename.forEach(issue => {
    console.log(`  - ${issue.productId} [${issue.type}]: ${issue.path}`);
  });
}

if (issues.chineseInFilename.length > 0) {
  console.log(`\n⚠️  文件名包含中文 (${issues.chineseInFilename.length}个):`);
  issues.chineseInFilename.forEach(issue => {
    console.log(`  - ${issue.productId} [${issue.type}]: ${issue.path}`);
  });
}

if (issues.pathInconsistency.length > 0) {
  console.log(`\n💡 路径不一致建议 (${issues.pathInconsistency.length}个):`);
  issues.pathInconsistency.forEach(issue => {
    console.log(`  - ${issue.productId} [${issue.type}]:`);
    console.log(`    当前: ${issue.path}`);
    console.log(`    建议: ${issue.suggestion}`);
  });
}

if (issues.pathMismatch.length > 0) {
  console.log(`\n⚠️  路径不匹配 (${issues.pathMismatch.length}个):`);
  issues.pathMismatch.forEach(issue => {
    console.log(`  - ${issue.productId} [${issue.type}]:`);
    console.log(`    期望: ${issue.expected}`);
    console.log(`    实际: ${issue.actual}`);
  });
}

// 5. 总结
const totalIssues = 
  issues.missingFiles.length +
  issues.caseSensitivity.length +
  issues.spacesInFilename.length +
  issues.chineseInFilename.length +
  issues.pathMismatch.length;

console.log('\n' + '='.repeat(60));
console.log(`\n📈 总计发现 ${totalIssues} 个潜在问题`);
console.log(`💡 路径一致性建议: ${issues.pathInconsistency.length} 个`);

if (totalIssues === 0 && issues.pathInconsistency.length === 0) {
  console.log('\n✅ 未发现严重问题！');
} else {
  console.log('\n⚠️  建议修复这些问题以避免服务器部署后出现破图。');
}

// 6. 生成修复建议
if (issues.pathInconsistency.length > 0 || issues.spacesInFilename.length > 0) {
  console.log('\n📝 修复建议:');
  console.log('1. 统一使用 /images/ 前缀（除了特殊文件如logo、icon等）');
  console.log('2. 重命名包含空格的文件名，使用连字符(-)或下划线(_)');
  console.log('3. 确保文件名使用小写字母和连字符');
  console.log('4. 在Linux服务器上，文件名大小写敏感，确保路径完全匹配');
  console.log('5. 使用 encodeURIComponent 处理包含特殊字符的路径');
}


