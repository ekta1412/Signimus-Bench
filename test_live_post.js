const fetch = require('node-fetch'); // we can also use native fetch since node version is 25

async function testLivePost() {
  const profile = {
    name: 'Test Live Developer',
    title: 'Live QA Engineer',
    experience: '3 years',
    skills: ['QA Testing', 'Live Deployment Test'],
    monthlyRate: '50000',
    resumeLink: 'https://example.com/test-resume',
    marketRate: '60000',
    professionalSummary: 'Testing if live save to TiDB database works from the API endpoint.',
    company_name: 'Signimus',
    company_type: 'signimus',
    fulfilled_by: 'Signimus',
    contact_number: '+919999999999',
    work_email: 'test@signimus.com',
    joinedAt: Date.now()
  };

  try {
    console.log('Sending POST request to live API...');
    const response = await fetch('https://signimus-bench.netlify.net/api/profiles', { // wait, Netlify URL is signimus-bench.netlify.app
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    
    // Fallback if netlify.net was a typo, let's try .app
    let data;
    if (!response.ok) {
      console.log('Trying netlify.app...');
      const response2 = await fetch('https://signimus-bench.netlify.app/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      console.log('Status Code:', response2.status);
      data = await response2.json();
    } else {
      console.log('Status Code:', response.status);
      data = await response.json();
    }
    
    console.log('Response:', data);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLivePost();
