const fs = require('fs');
let c = fs.readFileSync('public/jobs.html', 'utf8');
c = c.replace("const GET_JOBS_ENDPOINT = '/api/jobs'", "const GET_JOBS_ENDPOINT = '/api/jobs'");
c = c.replace('/.netlify/functions/get-jobs', '/api/jobs');
c = c.replace('/.netlify/functions/add-job', '/api/jobs');
fs.writeFileSync('public/jobs.html', c);
console.log('Done');
