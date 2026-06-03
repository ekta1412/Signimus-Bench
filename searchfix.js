const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(
  "        jobDescriptionInput.addEventListener('input', debounce(() => {\n            currentPage = 1;\n            syncUrlWithState();\n            triggerAnalysisForFilteredProfiles();\n            updateTitle();\n        }, 300));",
  "        jobDescriptionInput.addEventListener('input', debounce(() => {\n            const q = jobDescriptionInput.value.toLowerCase().trim();\n            document.querySelectorAll('.profile-card').forEach(card => {\n                card.style.display = q === '' || card.innerText.toLowerCase().includes(q) ? '' : 'none';\n            });\n            updateTitle();\n        }, 100));"
);
fs.writeFileSync('index.html', c);
console.log('Done');
