const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('<textarea id="job-description-input" style="display:none"', '<input type="text" id="name-search-input" class="w-full p-2 mb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search by name, skill, title...">\n<textarea id="job-description-input" style="display:none"');
fs.writeFileSync('index.html', c);
console.log('Done');
