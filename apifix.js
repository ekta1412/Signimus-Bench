const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  "['/.netlify/functions/get-profiles', '/api/profiles']",
  "['/api/profiles', '/.netlify/functions/get-profiles']"
);
c = c.replace(
  "['/.netlify/functions/add-profile', '/api/profiles']",
  "['/api/profiles', '/.netlify/functions/add-profile']"
);
fs.writeFileSync('index.html', c);
console.log('Done');
