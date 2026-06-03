const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
// Move name-search-input to top, before job description
c = c.replace('<div class="mb-2"><input type="text" id="name-search-input" class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search by name, skill, title..."></div><div class="flex items-center justify-between mb-2">', '<div class="flex items-center justify-between mb-2">');
c = c.replace('<textarea id="job-description-input"', '<input type="text" id="name-search-input" class="w-full p-2 mb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search by name, skill, title...">\n<textarea id="job-description-input" style="display:none"');
fs.writeFileSync('index.html', c);
console.log('Done');
