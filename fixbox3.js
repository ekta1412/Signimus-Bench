const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('                    \n                        <textarea id="job-description-input" class="w-full h-12 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150 resize-none" placeholder="Search by name, skill, or paste job description..."></textarea>\n                    </div>', '');
fs.writeFileSync('index.html', c);
console.log('Done');
