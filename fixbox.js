const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(/<div class="relative mt-1">\s*<textarea id="job-description-input"[^>]*>.*?<\/textarea>\s*<\/div>/s, '');
fs.writeFileSync('index.html', c);
console.log('Done');
