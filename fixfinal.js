const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
const regex = /document\.getElementById\(["']name-search-input["']\)\.addEventListener[^;]+;/g;
c = c.replace(regex, '');
const js = '\n<script>\ndocument.addEventListener("DOMContentLoaded",function(){var box=document.getElementById("name-search-input");if(box){box.addEventListener("input",function(){var q=this.value.toLowerCase().trim();document.querySelectorAll(".profile-card").forEach(function(card){card.style.display=q===""||card.innerText.toLowerCase().indexOf(q)>-1?"":"none";});});}});\n</script>';
c = c.replace('</body>', js + '\n</body>');
fs.writeFileSync('index.html', c);
console.log('Done');
