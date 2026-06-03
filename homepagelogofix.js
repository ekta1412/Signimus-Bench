const fs = require('fs');
let c = fs.readFileSync('public/homepage.html', 'utf8');
c = c.replace(
  /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" class="h-8 w-8 text-indigo-600"[\s\S]*?<\/svg>/m,
  '<img src="/logo.png" width="40" height="40">'
);
fs.writeFileSync('public/homepage.html', c);
console.log('Done');
