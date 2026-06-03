const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('if (jd) params.set(\'jd\', jd);', '// if (jd) params.set(\'jd\', jd);');
fs.writeFileSync('index.html', c);
console.log('Done');
