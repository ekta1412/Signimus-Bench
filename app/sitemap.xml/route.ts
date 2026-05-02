export async function GET() {
  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Engineer",
    "Data Scientist",
    "Product Manager",
    "DevOps Engineer",
    "QA Engineer",
    "Mobile Developer",
    "AI Engineer",
    // High-impact growth/marketing/SEO roles
    "Growth Engineer",
    "SEO Specialist",
    "Automation Architect",
    "Analytics Lead",
    "Conversion Manager",
    "Content Strategist",
    "Email Marketing Manager",
    "Social Media Manager",
    "Customer Success Manager",
    "Community Manager",
    "Brand Manager",
    "Copywriter"
  ];
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "TensorFlow",
    "Pandas",
    "Vue.js",
    "Angular",
    "Swift",
    "Go",
    "Ruby",
    // High-impact growth/marketing/SEO skills
    "growth-engineering",
    "seo",
    "automation",
    "analytics",
    "conversion-optimization",
    "content-marketing",
    "email-marketing",
    "social-media",
    "product-management",
    "user-research",
    "data-science",
    "a/b-testing",
    "customer-success",
    "community-building",
    "branding",
    "copywriting"
  ];
  const baseUrl = "https://localhost:3001";
  const roleUrls = roles.map(role => {
    const slug = encodeURIComponent(role);
    return `<url><loc>${baseUrl}/roles/${slug}</loc></url>`;
  });
  const skillUrls = skills.map(skill => {
    const slug = encodeURIComponent(skill);
    return `<url><loc>${baseUrl}/skills/${slug}</loc></url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${roleUrls.join("\n")}
${skillUrls.join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
