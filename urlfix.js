const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
// Find the syncUrlWithState function and prevent jd from being set
c = c.replace(
  "params.set('jd', jobDescriptionInput.value.trim());",
  "// params.set('jd', jobDescriptionInput.value.trim());"
);
fs.writeFileSync('index.html', c);
console.log('Done');
