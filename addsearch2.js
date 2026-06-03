const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('<div class="relative mt-1">', '<div class="relative mt-1"><input type="text" id="name-search-input" class="w-full p-2 mb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search by name, skill, title...">');
fs.writeFileSync('index.html', c);
console.log('Done');
