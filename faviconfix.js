const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(/<link rel="icon" href="data:image\/svg\+xml[^>]*>/g, '');
fs.writeFileSync('index.html', c);
console.log('Done');
