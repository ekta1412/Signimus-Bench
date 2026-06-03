const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  "        jobDescriptionInput.addEventListener('input', debounce(() => {",
  "        if(jobDescriptionInput) jobDescriptionInput.addEventListener('input', debounce(() => {"
);
fs.writeFileSync('index.html', c);
console.log('Done');
