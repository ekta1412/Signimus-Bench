import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skill: [skill] | Signimus Bench",
  description: "Explore top talent, projects, and experience for the [skill] skill. Instant shortlist, AI-powered insights, and zero-friction registration.",
};

export default function SkillPage({ params }: { params: { skill: string } }) {
  const skill = decodeURIComponent(params.skill);
  return (
    <main className="min-h-screen w-full bg-white text-slate-800">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{skill} Talent Bench</h1>
        <p className="mb-6 text-slate-700">Discover top candidates, filter by experience and related skills, and create instant shortlists for the skill: <strong>{skill}</strong>.</p>
        {/* SEO: Add structured data, meta tags, and links to related skills/roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-2">Related Skills</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>JavaScript</li>
              <li>TypeScript</li>
              <li>React</li>
              <li>Node.js</li>
              {/* Dynamically generate based on skill */}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Experience Range</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>1-3 years</li>
              <li>3-5 years</li>
              <li>5+ years</li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <a href="/register" className="inline-block px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Register to shortlist candidates</a>
        </div>
      </section>
    </main>
  );
}
