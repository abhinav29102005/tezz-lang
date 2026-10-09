const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const srcDir = path.join(rootDir, 'src');

const targets = [
  path.resolve(__dirname, '../server/compiler'),
  path.resolve(__dirname, '../server/out/compiler')
];

for (const targetDir of targets) {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const file of ['lexer.js', 'parser.js', 'formatter.js']) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(targetDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file} -> ${path.relative(rootDir, destFile)}`);
    } else {
      console.warn(`Warning: ${srcFile} not found`);
    }
  }
}
console.log('Compiler sync complete.');
