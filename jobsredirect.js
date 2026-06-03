const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  "document.getElementById('jobs-button').addEventListener('click', openJobsModal);",
  "document.getElementById('jobs-button').addEventListener('click', function(){ window.open('/jobs.html', '_blank'); });"
);
fs.writeFileSync('index.html', c);
console.log('Done');
