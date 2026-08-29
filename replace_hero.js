const fs = require('fs');
let content = fs.readFileSync('website/index.html', 'utf8');
content = content.replace(/<svg viewBox="0 0 675 250" class="hero-logo floating">[\s\S]*?<\/svg>/, '<img src="/favicon.svg" alt="Tezz Hero Logo" class="hero-logo floating" />');
fs.writeFileSync('website/index.html', content);
console.log("Replaced hero SVG");
