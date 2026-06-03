const fs = require('fs');
const path = require('path');

// Read developers data
const developersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'developers.json'), 'utf-8'));

// Transform developers to profiles format
const profiles = developersData.developers
  .filter(dev => dev.name && dev.name.trim()) // Filter out empty names
  .map((dev, index) => {
    const skillsList = dev.skills ? dev.skills.split(',').map(s => s.trim()) : ['Developer'];
    return {
      id: dev.employee_id || `dev-${index}`,
      name: dev.name.trim(),
      title: skillsList[0] || 'Developer',
      experience: dev.experience || 'Not specified',
      skills: skillsList,
      monthlyRate: dev.monthly_rate_inr || 'On Request',
      resumeLink: dev.resume_link || 'Profile on Request',
      marketRate: dev.monthly_rate_inr || 'On Request',
      company_type: 'partner',
      fulfilled_by: 'Pythonmate'
    };
  });

async function addDevelopers() {
  try {
    console.log(`📤 Adding ${profiles.length} developers to database...`);
    
    const response = await fetch('http://localhost:3000/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profiles)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success! Added ${result.count || profiles.length} developers`);
      console.log(`📊 Response:`, result);
    } else {
      console.error(`❌ Error (${response.status}):`, result);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure the dev server is running: npm run dev');
  }
}

addDevelopers();
