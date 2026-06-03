const fs = require('fs');
let c = fs.readFileSync('homepage.html', 'utf8');
c = c.replace(/<link rel="icon"[^>]*>/g, '<link rel="icon" href="/logo.png" type="image/png">');
fs.writeFileSync('homepage.html', c);
console.log('Done');
