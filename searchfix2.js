const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  'card.style.display=q===""||card.innerText.toLowerCase().indexOf(q)>-1?"":"none";',
  'card.style.display=q===""||card.textContent.toLowerCase().indexOf(q)>-1?"":"none";'
);
fs.writeFileSync('index.html', c);
console.log('Done');
