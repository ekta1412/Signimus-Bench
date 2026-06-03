const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" style="flex-shrink:0;" class="cursor-pointer" id="logo-btn" title="Signimus Home">\n                    <rect width="36" height="36" rx="8" fill="#4F46E5"/>\n                    <path d="M24.5 13.5C24.5 11.015 22.485 9 20 9H14C11.515 9 9.5 11.015 9.5 13.5C9.5 15.985 11.515 18 14 18H22C24.485 18 26.5 20.015 26.5 22.5C26.5 24.985 24.485 27 22 27H16C13.515 27 11.5 24.985 11.5 22.5" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>\n                </svg>',
  '<img src="/logo.png" width="72" height="72" style="flex-shrink:0;cursor:pointer;" id="logo-btn" title="Signimus Home">'
);
fs.writeFileSync('index.html', c);
console.log('Done');
