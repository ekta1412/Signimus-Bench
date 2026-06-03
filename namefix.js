const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
// Change the visible input to not trigger job description analysis
c = c.replace(
  '<div class="mt-2"><input type="text" id="name-search-input"',
  '<div class="mt-2"><input type="text" id="name-search-input" oninput="event.stopPropagation();"'
);
fs.writeFileSync('index.html', c);
console.log('Done');
