const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
// Fix 1: autocomplete off
c = c.replace(
  'id="name-search-input"',
  'id="name-search-input" autocomplete="off"'
);
fs.writeFileSync('index.html', c);
console.log('Done');
