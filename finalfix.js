const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
// Replace the visible input with name search and hide job desc textarea
c = c.replace('<input type="text" id="name-search-input"', '<input type="text" id="name-search-input" onkeyup="var q=this.value.toLowerCase();document.querySelectorAll(\'.profile-card\').forEach(function(card){card.style.display=q===\'\'||card.innerText.toLowerCase().indexOf(q)>-1?\'block\':\'none\';})"');
fs.writeFileSync('index.html', c);
console.log('Done');
