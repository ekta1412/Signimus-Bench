const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  'const allP = window._allBenchProfiles || [];',
  'const allP = profilesData || [];'
);
fs.writeFileSync('index.html', c);
console.log('Done');
