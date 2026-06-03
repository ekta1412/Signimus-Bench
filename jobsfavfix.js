const fs = require('fs');
let c = fs.readFileSync('jobs.html', 'utf8');
c = c.replace(/<link rel="icon"[^>]*>/g, '<link rel="icon" href="/logo.png" type="image/png">');
fs.writeFileSync('jobs.html', c);
console.log('Done');
