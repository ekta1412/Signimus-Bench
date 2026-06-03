const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('<head>', '<head>\n<link rel="icon" href="/logo.png" type="image/png">');
fs.writeFileSync('index.html', c);
console.log('Done');
