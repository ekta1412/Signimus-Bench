const fs = require('fs');
['index.html', 'public/index.html'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace('Joint Bench Developer Form', 'Apply for Bench');
  fs.writeFileSync(f, c);
  console.log('Fixed:', f);
});
