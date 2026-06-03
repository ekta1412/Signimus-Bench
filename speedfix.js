const fs = require('fs');

// Fix index.html - add preconnect for database API
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  '<link rel="icon" href="/logo.png" type="image/png">',
  `<link rel="icon" href="/logo.png" type="image/png">
<link rel="preconnect" href="https://bench.signimus.com">
<link rel="dns-prefetch" href="https://bench.signimus.com">
<link rel="preload" href="/logo.png" as="image">
<link rel="preload" href="/api/profiles" as="fetch" crossorigin>`
);
fs.writeFileSync('index.html', c);

// Fix jobs.html - same
let j = fs.readFileSync('jobs.html', 'utf8');
j = j.replace(
  '<link rel="icon" href="/logo.png" type="image/png">',
  `<link rel="icon" href="/logo.png" type="image/png">
<link rel="preconnect" href="https://bench.signimus.com">
<link rel="dns-prefetch" href="https://bench.signimus.com">
<link rel="preload" href="/logo.png" as="image">
<link rel="preload" href="/api/jobs" as="fetch" crossorigin>`
);
fs.writeFileSync('jobs.html', j);

console.log('Done');
