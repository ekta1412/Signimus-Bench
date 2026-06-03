const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  '<div class="mt-2"><input type="text" id="name-search-input" oninput="event.stopPropagation();" class="w-full p-2 text-sm border border-gray-300 rounded-lg" placeholder="Search by name, skill, title..."></div>',
  '<textarea id="job-description-input" style="display:none" placeholder=""></textarea><div class="mt-2"><input type="text" id="name-search-input" class="w-full p-2 text-sm border border-gray-300 rounded-lg" placeholder="Search by name, skill, title..."></div>'
);
fs.writeFileSync('index.html', c);
console.log('Done');
