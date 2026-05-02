import Link from "next/link";

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

export default function SkillsIndex() {
  return (
    <main className="min-h-screen w-full bg-white text-slate-800">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Explore Talent by Skill</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map(skill => (
            <li key={skill}>
              <Link href={`/skills/${encodeURIComponent(skill)}`} className="block px-6 py-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold shadow">
                {skill}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
