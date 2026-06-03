const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// 1. Remove broken search listener at line 1873
c = c.replace(
  /document\.addEventListener\("DOMContentLoaded",function\(\)\{var box=document\.getElementById\("name-search-input"\);[\s\S]*?\}\}\);/,
  ''
);

// 2. Add nameQuery variable near currentPage
c = c.replace(
  'let currentPage = 1;',
  'let currentPage = 1;\n        let nameSearchQuery = "";'
);

// 3. Hook search input into renderProfiles
c = c.replace(
  'if(jobDescriptionInput) jobDescriptionInput.addEventListener(\'input\', debounce(() => {',
  `const nameSearchBox = document.getElementById('name-search-input');
        if(nameSearchBox) nameSearchBox.addEventListener('input', function() {
          nameSearchQuery = this.value.toLowerCase().trim();
          currentPage = 1;
          renderProfiles();
        });
        if(jobDescriptionInput) jobDescriptionInput.addEventListener('input', debounce(() => {`
);

// 4. Filter by nameSearchQuery inside getFilteredAndSortedProfiles
c = c.replace(
  'function getFilteredAndSortedProfiles() {',
  `function getFilteredAndSortedProfiles() {
            if(nameSearchQuery) {
              const allP = window._allBenchProfiles || [];
              const filtered = allP.filter(p => {
                const hay = ((p.name||'')+(p.title||'')+(Array.isArray(p.skills)?p.skills.join(' '):'')).toLowerCase();
                return hay.includes(nameSearchQuery);
              });
              return { matching: filtered, nonMatching: [] };
            }`
);

fs.writeFileSync('index.html', c);
console.log('Done');
