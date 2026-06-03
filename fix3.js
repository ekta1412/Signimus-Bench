const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace('</body>', 'document.getElementById("name-search-input").addEventListener("input",function(){const q=this.value.toLowerCase().trim();document.querySelectorAll(".profile-card").forEach(card=>{card.style.display=q===""||card.innerText.toLowerCase().includes(q)?"":"none";});});\n</body>');
fs.writeFileSync('index.html', c);
console.log('Done');
