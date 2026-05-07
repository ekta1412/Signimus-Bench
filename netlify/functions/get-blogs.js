const mysql = require('mysql2/promise');

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
};

const BLOG_SKILLS = [
  'Salesforce Developer','Design','Bootstrap','Tailwind CSS','Material UI','Responsive Websites','Animations','Figma','Photoshop','Adobe XD','React.js','Ruby on Rails','.NET','Angular','Java','Core Java','Spring','Spring Boot','REST API','Spring Data JPA','Hibernate','JPA','MySQL','Kafka','Redis','AWS','Spring Security','Marketing','Product Designer','UI/UX','Graphics Design','XD','DaVinci Resolve','UIZARD','Zeplin','Illustrator','Canva','Ethical Hacking','Penetration Tester','WAPT','Python','Scapy','Reverse Engineering','Automation','iOS','Swift','Objective-C','SwiftUI','Python Django Developer','Scikit-learn','Basic Data Science','Data Scientist','AI/ML Engineer','TensorFlow','PyTorch','Data Engineer','Frontend','Java Developer','MERN Stack','Node.js','Microservices','Docker','Next.js','J2EE','Django','DRF','FastAPI','Pytest','Flask','TypeScript','NodeJs','Technical Lead','Flutter','Dart','Android','Kotlin','Laravel','CodeIgniter','PHP','DevOps','SRE','Kubernetes','Terraform','CI/CD','Dell Boomi Developer','Integration','API Development','App Script','Core PHP','MongoDB','GoDaddy','Digital Ocean','Razorpay Payment Gateway','Git','Firebase','Sr iOS Developer','Power BI','AI Development','Oracle','Data Warehousing','ETL','DataStage','SQL','Data Analytics','Adobe DTM','Adobe Launch','Google Tag Manager','Adobe Analytics','Front-End Technologies','Selenium','AutoGen','Gen AI (Azure)','MS Excel','Machine Learning','Gen AI Assistant','Junior Developer','Project Manager','WordPress Website Developer','Frontend Development'
];

function json(statusCode, body) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(body) };
}

function slugify(value) {
  return String(value || 'blog').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'blog';
}

function makeBlog(skill) {
  const slug = `hire-${slugify(skill)}`;
  return {
    id: slug,
    slug,
    skill,
    title: `How to Hire ${skill} Talent`,
    excerpt: `A practical guide to evaluating ${skill} skills, interview signals, and hiring fit.`,
    readMinutes: 6,
    content: [
      `Hiring for ${skill} works best when the role is defined around real project outcomes, not only keywords.`,
      `Start by checking portfolio depth, production experience, debugging habits, communication clarity, and how the candidate explains tradeoffs.`,
      `Use a short practical task that mirrors your work: review code, design a small feature, debug a realistic issue, or explain an architecture decision.`,
      `For salary discussions, compare scope, seniority, ownership level, and delivery responsibility before finalizing the offer.`
    ]
  };
}

async function getConnection() {
  return mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000', 10),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  });
}

async function ensureTable(conn) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS hiring_blogs (
      id VARCHAR(160) PRIMARY KEY,
      slug VARCHAR(160) NOT NULL UNIQUE,
      skill VARCHAR(160) NOT NULL,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content LONGTEXT,
      read_minutes INT DEFAULT 6,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedBlogs(conn) {
  const blogs = [...new Set(BLOG_SKILLS)].map(makeBlog);
  for (const blog of blogs) {
    await conn.execute(
      `INSERT IGNORE INTO hiring_blogs
        (id, slug, skill, title, excerpt, content, read_minutes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [blog.id, blog.slug, blog.skill, blog.title, blog.excerpt, JSON.stringify(blog.content), blog.readMinutes]
    );
  }
}

function parseContent(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

exports.handler = async (event = {}) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod && event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  let conn;
  try {
    conn = await getConnection();
    await ensureTable(conn);
    await seedBlogs(conn);
    const [rows] = await conn.execute('SELECT * FROM hiring_blogs ORDER BY skill ASC');
    return json(200, {
      blogs: rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        skill: row.skill,
        title: row.title,
        excerpt: row.excerpt || '',
        content: parseContent(row.content),
        readMinutes: row.read_minutes || 6,
        source: 'database',
      })),
    });
  } catch (error) {
    console.error('get-blogs error:', error);
    return json(500, { error: error.message });
  } finally {
    if (conn) await conn.end();
  }
};
