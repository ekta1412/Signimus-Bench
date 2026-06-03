const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
const searchBox = '                    <div class="mt-2"><input type="text" id="name-search-input" class="w-full p-2 text-sm border border-gray-300 rounded-lg" placeholder="Search by name, skill, title..."></div>\n';
c = c.replace('                    <div class="mt-2 flex flex-col sm:flex-row gap-2">', searchBox + '                    <div class="mt-2 flex flex-col sm:flex-row gap-2">');
fs.writeFileSync('index.html', c);
console.log('Done');
