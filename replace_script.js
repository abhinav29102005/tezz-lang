const fs = require('fs');

function replaceSvg(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<svg viewBox="0 0 675 250" style="height: 30px; margin-right: 10px;" class="animated-logo">[\s\S]*?<\/svg>/, '<img src="/favicon.svg" alt="Tezz Logo" style="height: 30px; margin-right: 10px;" class="animated-logo" />');
  fs.writeFileSync(filePath, content);
}

replaceSvg('generate_docs.js');
replaceSvg('website/index.html');

console.log("Replaced header SVGs");
