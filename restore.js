const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  '<div class="mt-2"><input type="text" id="name-search-input" class="w-full p-2 text-sm border border-gray-300 rounded-lg" placeholder="Search by name, skill, title..."></div>',
  '<div class="mt-2"><input type="text" id="name-search-input" class="w-full p-2 text-sm border border-gray-300 rounded-lg" placeholder="Search by name, skill, title..."><textarea id="job-description-input" class="w-full h-1 opacity-0 absolute" placeholder=""></textarea></div>'
);
fs.writeFileSync('index.html', c);
console.log('Done');
