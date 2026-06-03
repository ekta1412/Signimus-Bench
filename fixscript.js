const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
// Remove visible JS text at bottom
c = c.replace(/document\.querySelectorAll\("\.profile-card"\)\.forEach\(card=>\{card\.style\.display=q===""\|\|card\.innerText\.toLowerCase\(\)\.includes\(q\)\?"":"none";\}\);\}\);\s*document\.querySelectorAll\("\.profile-card"\)\.forEach\(card=>\{card\.style\.display=q===""\|\|card\.innerText\.toLowerCase\(\)\.includes\(q\)\?"":"none";\}\);\}\);/g, '');
fs.writeFileSync('index.html', c);
console.log('Done');
