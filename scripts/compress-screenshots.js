const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '../public/ScreenShot');

async function compressImages() {
  const files = fs.readdirSync(screenshotDir).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(screenshotDir, file);
    const outputPath = path.join(screenshotDir, file.replace('.png', '_compressed.png'));
    
    const originalSize = fs.statSync(inputPath).size;
    
    await sharp(inputPath)
      .resize(1920, null, { withoutEnlargement: true }) // 限制最大宽度为1920
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outputPath);
    
    const newSize = fs.statSync(outputPath).size;
    
    // 替换原文件
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    
    console.log(`${file}: ${(originalSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
  console.log('\nAll screenshots compressed!');
}

compressImages().catch(console.error);

