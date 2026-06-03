const fs = require('fs');
let c = fs.readFileSync('jobs.html', 'utf8');
const oldFn = `        async function loadRemoteJobs(force = false) {
            if (jobsLoaded && !force) return;
            try {
                const response = await fetch(GET_JOBS_ENDPOINT, { cache: 'no-store' });
                if (!response.ok) throw new Error(\`Server error: \${response.status}\`);
                const data = await response.json();
                remoteJobs = Array.isArray(data.jobs) ? data.jobs : [];
                jobsLoadError = '';
            } catch (error) {
                console.warn('Unable to load shared jobs.', error);
                jobsLoadError = 'Could not load jobs from database. Showing default jobs.';
                remoteJobs = [];
            } finally {
                jobsLoaded = true;
            }
        }`;
const newFn = `        async function loadRemoteJobs(force = false) {
            if (jobsLoaded && !force) return;
            const JCACHE = 'signimus_jobs_cache';
            const JTIME = 'signimus_jobs_cache_time';
            try {
                const cached = localStorage.getItem(JCACHE);
                const cachedAt = localStorage.getItem(JTIME);
                if (!force && cached && cachedAt && (Date.now() - parseInt(cachedAt)) < 300000) {
                    remoteJobs = JSON.parse(cached);
                    jobsLoadError = '';
                    jobsLoaded = true;
                    fetch(GET_JOBS_ENDPOINT).then(r=>r.json()).then(d=>{const j=Array.isArray(d.jobs)?d.jobs:[];localStorage.setItem(JCACHE,JSON.stringify(j));localStorage.setItem(JTIME,Date.now());}).catch(()=>{});
                    return;
                }
                const response = await fetch(GET_JOBS_ENDPOINT, { cache: 'no-store' });
                if (!response.ok) throw new Error('Server error: ' + response.status);
                const data = await response.json();
                remoteJobs = Array.isArray(data.jobs) ? data.jobs : [];
                try { localStorage.setItem(JCACHE, JSON.stringify(remoteJobs)); localStorage.setItem(JTIME, Date.now()); } catch(e) {}
                jobsLoadError = '';
            } catch (error) {
                console.warn('Unable to load shared jobs.', error);
                jobsLoadError = 'Could not load jobs from database. Showing default jobs.';
                remoteJobs = [];
            } finally {
                jobsLoaded = true;
            }
        }`;
c = c.replace(oldFn, newFn);
fs.writeFileSync('jobs.html', c);
console.log(c.includes('JCACHE') ? 'Done' : 'Replace failed');
