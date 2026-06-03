const fs = require('fs');
let c = fs.readFileSync('public/jobs.html', 'utf8');
c = c.replace('href="logo.png"', 'href="/logo.png"');
c = c.replace('src="logo.png"', 'src="/logo.png"');
fs.writeFileSync('public/jobs.html', c);
console.log('Done');
