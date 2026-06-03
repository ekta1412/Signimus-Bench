const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
const js = 'document.getElementById("name-search-input").addEventListener("input",function(){const q=this.value.toLowerCase().trim();document.querySelectorAll(".profile-card").forEach(card=>{card.style.display=q===""||card.innerText.toLowerCase().includes(q)?"":"none";});});';
c = c.replace('</script>', js + '</script>');
fs.writeFileSync('index.html', c);
console.log('Done');
