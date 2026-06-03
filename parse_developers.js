const fs = require('fs');

// CSV data as string (already have it)
const csvLines = `E.ID.,Name,Role,Experience,Monthly Rate (INR),Resume link
78,Sunny,"Django, Flask, Fastapi, Expressjs",4 years,100000,https://docs.google.com/document/d/1Rc84WXE_PQKpA999VZ8JgKN0xAE9Fsgw/edit?usp=sharing&ouid=117177505366594186454&rtpof=true&sd=true
136,Ankur,"Python, Django, DRF, fastAPI,Pytest,  Flask",5 years,200000,https://docs.google.com/document/d/1YXAO0VrfQO5-UJLibgh9psra8wDGTpgw5H9VxjDDJ1c/edit?usp=sharing
214,Akash,"Python, Pytest and AI developer,",3 years,60000,https://docs.google.com/document/d/10Xpu8R1Zy7rfCIKRHIrzpDJKhoOfOTz8n084f5pK5BI/edit?tab=t.0
338,Atif,"Python, Go lang, Flask , fast api, Pytest, django gin , express js",5-6 years,150000,https://docs.google.com/document/d/1g3IVKjbPd7wRKkIfYHJBFBryNyoPxvye3NhhSywTYPU/edit?usp=sharing
446,shatrunjay,"Python, Data analyst",3 years,80000,https://docs.google.com/document/d/1qTRTPLROeOcGoDnGjDk56dp77eMzQtbSZ7n7d0VKUdw/edit?usp=sharing
517,Ayan,Python/selenium/django/sql,1.6,20000,https://docs.google.com/document/d/1EeIhZEXgSyWIA9ygzty_DLZ0RiCL1shH/edit
605,Shahzaib,"Java Springboot, mysql, postgresql",3 years,30000,https://docs.google.com/document/d/1xZH_njdjzg6xG54OllMnb3J7tDXv7B5Uuyc82qElnqE/edit?usp=sharing
692,Ankit,"Java developer, spring boot",2 years,"40,000",https://docs.google.com/document/d/1tkjTteVMCQiAOfD_47E8ELkx2AN3xcbUbH8csulFONc/edit?usp=sharing
771,vijay,"Laravel, Nextjs, Codeigniter",9,180000,https://docs.google.com/document/d/1U0Uh7tEe9RqyVaNDrLGf3tyHIHf_KX-8JQ7Qzv32u-Y/edit?usp=sharing
863,Bhavik,"ReactJs, NodeJs",3 years,110000,https://drive.google.com/file/d/1fJDuun2-0c26Do5Kkvj-ndyHIJB-yb1V/view?usp=sharing
954,Hemant,"ReactJs, NodeJs",6+,200000,https://docs.google.com/document/d/1lbdqZMUSaTnE2lyHvWWDKtN3ITQdfkqM8INpx-mfEXI/edit?tab=t.0
742,Ishika S Dabare,"Python, C++, SQL, DBMS, Prompt Engineering, RAG, Autogen, Gen AI on Azure, MS Excel, Machine Learning/ Preffered Role: Gen AI assistant or Junior Developer or Project Manager",1.8*,#VALUE!,https://docs.google.com/document/d/19odqw3zP8Ya6W7NwTdQnw0B0VNF-4ySro6H8vXVkQIc/edit?usp=sharing
131,Gauri,"Node JS, AWS services, Angular, React JS",8 years,500000,https://docs.google.com/document/d/1Niw2MCfBgBuvU1l3l2G5VsTqG9balYE-/edit?usp=sharing&ouid=117364931730985774716&rtpof=true&sd=true
121,Hema,"Data Analytics, Adobe DTM, Adobe Launch, Google Tag Manager, Adobe Analytics, and front-end technologies.",3 years,120000,https://docs.google.com/document/d/1vtNS8ObZPkSX-deXxiPDfO6Qcqs8xR4hlhpda8a2yeo/edit?tab=t.0#heading=h.dj5ewqwogcx
130,Yasir,"ReactJS, NextJS, NodeJS",3 years,140000,https://docs.google.com/document/d/1g1_kJYbDe_d_AHC54BnjCSVDGLt1f0tf4MyNq8VKS7c/edit?tab=t.0#heading=h.dqajha86lp2k
761,Helly ,Python Developer,4.5 yeras,157000,https://drive.google.com/drive/u/1/folders/13XiEyxnWZfy-ydcwAyVDna98byLlLig3
261,Kaushik,Python Developer,4 years ,140000,https://drive.google.com/drive/u/1/folders/13XiEyxnWZfy-ydcwAyVDna98byLlLig3
569,Dinesh,Python + Django Developer,5+,110K,
570,Gopal,Python + Django Developer,5+,110K,https://docs.google.com/document/d/12ReXm9HVNW_cjADTnRLKfjW3eLBKfFn6/edit
121,Divyesh,Python + Django Developer,5 years,175000,https://drive.google.com/drive/u/1/folders/13XiEyxnWZfy-ydcwAyVDna98byLlLig3
521,Ankit,Python + Django Developer,4 years ,140000,https://drive.google.com/drive/u/1/folders/13XiEyxnWZfy-ydcwAyVDna98byLlLig3
122,Siddharth ,Python + Django Developer,2 years,70000,https://drive.google.com/drive/u/1/folders/13XiEyxnWZfy-ydcwAyVDna98byLlLig3
,Md Rehan,Python + Django Developer/ Full stack developer,8 years,,https://docs.google.com/document/d/1vaNOxx_Erm1d2UWEh_e15yDWtBAL2gqx/edit
567,Kinajal,Manual Tester ,4 years ,95 K ,
568,Shubham,Manual Tester ,3,95 K,
522,Ashish,Machine Learning Developer ,3.5+,130k,https://docs.google.com/document/d/1RpjvcDJICHrQ85yGLEtYkpGiwWyznti8/edit
551,Vasanthi ,Java Full Stack Developer,7+ years,1.50L + GST,
,Vivek,Java Developer,,,https://docs.google.com/document/d/1q5zldFJe9224-K64XyZ44XkexH0M-zJn/edit
552,Aadil,Java Developer,4 years ,1.65L + GST,
553,Shivani,Java Developer,4 years ,1.65L + GST,
554,Yash,Java Developer,4 years ,1.65L + GST,
555,Anil,Java Developer,18+,2.25L + GST,
556,Vishnu,Java Developer,4 years ,1L + GST,
557,Mahi,Angular Developer,2.5+ years,1L + GST,
558,Bhargavi,Angular Developer,2.5+ years,1L + GST,
559,Naveen,Angular Developer,2.5+ years,1L + GST,
560,Vasanthi,Angular Developer,2.5+ years,1L + GST,
561,Mahesh,Angular Developer,2.5+ years,1L + GST,
562,Mahi,Angular Developer,2.5+ years,1L + GST,
563,Bhargavi,Angular Developer,2.5+ years,1L + GST,
564,Naveen,Angular Developer,2.5+ years,1L + GST,
565,Vasanthi,Angular Developer,2.5+ years,1L + GST,
566,Mahesh,Angular Developer,2.5+ years,1L + GST,
567,Sasank,MERN,5+ years,1.60 + GST,https://drive.google.com/drive/u/1/folders/10qMQP4cS57Im2Mhuw39TlM6SrOBrvHLy
568,Shivam,MERN,5+ years,1.65 +GST,https://drive.google.com/drive/u/1/folders/10qMQP4cS57Im2Mhuw39TlM6SrOBrvHLy
569,Sangram,MERN,8+ Years,1.50 +GST,https://drive.google.com/drive/u/1/folders/10qMQP4cS57Im2Mhuw39TlM6SrOBrvHLy
570,Aashish,MERN,5+ years,2.30 + GST,
571,Vidhi,MERN,5+ years,1.60 +GST,
572,Mohsin,MERN,4+ years,1.60+ GST,
573,Priyal,MERN,5+ years,1.80 +GST,https://drive.google.com/drive/u/1/folders/10qMQP4cS57Im2Mhuw39TlM6SrOBrvHLy
574,Ashish ,MERN,5 years,1.60 + GST,
575,Amit,Reactjs/SQL,5 years,,https://drive.google.com/drive/u/1/folders/1SymJi9GJEkcGyr03D0yaRhJFz1xDydto
576,Satyam,Angular/Reactjs,5 years,,https://drive.google.com/drive/u/1/folders/1SymJi9GJEkcGyr03D0yaRhJFz1xDydto
577,Simram,Frontend/Reactjs,3 years,,https://drive.google.com/drive/u/1/folders/1SymJi9GJEkcGyr03D0yaRhJFz1xDydto
578,Param,Dot net/Full stack,10+ Years,,
579,Logesh,,,,
,Raj,Dot net ,5 years ,,`.split('\n').slice(1);

const developers = [];
csvLines.forEach(line => {
  if (!line.trim()) return;
  
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') inQuotes = !inQuotes;
    else if (line[i] === ',' && !inQuotes) {
      parts.push(current.replace(/"/g, '').trim());
      current = '';
    } else {
      current += line[i];
    }
  }
  parts.push(current.replace(/"/g, '').trim());
  
  const [eid, name, skills, exp, rate, resume] = parts;
  if (name) {
    developers.push({
      employee_id: eid || null,
      name: name.trim(),
      skills: skills || null,
      experience: exp || null,
      monthly_rate_inr: rate || null,
      resume_link: resume || null
    });
  }
});

const output = {
  total_developers: developers.length,
  developers,
  sheet_name: "Pythonmate Developers Bench Rate Card Sheet",
  exported_date: new Date().toISOString()
};

fs.writeFileSync('developers.json', JSON.stringify(output, null, 2));
console.log(`✓ Parsed ${developers.length} developers\n`);
console.log('First 5 developers:');
developers.slice(0, 5).forEach((d, i) => {
  console.log(`\n${i+1}. ${d.name} (ID: ${d.employee_id})`);
  console.log(`   Skills: ${d.skills}`);
  console.log(`   Experience: ${d.experience}`);
  console.log(`   Rate: ${d.monthly_rate_inr}`);
});
