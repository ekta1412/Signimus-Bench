import Link from "next/link";

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

export default function RolesIndex() {
  return (
    <main className="min-h-screen w-full bg-white text-slate-800">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Explore Talent by Role</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(role => (
            <li key={role}>
              <Link href={`/roles/${encodeURIComponent(role)}`} className="block px-6 py-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold shadow">
                {role}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
