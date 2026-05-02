import pseoData from '../../../lib/pseo-data.json';
import relatedTools from '../../../lib/related-tools.json';

export async function generateStaticParams() {
  return pseoData.map((item) => ({
    slug: item.slug,
  }));
}

interface ComparePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const data = pseoData.find((item) => item.slug === slug);

  if (!data) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Comparison not found</h1>
        <p className="text-lg mt-4">The code comparison you are looking for could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">{data.title}</h1>
        <p className="text-xl mt-4">{data.description}</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="code-block">
          <h2 className="text-2xl font-bold mb-4">Option A</h2>
          <pre className="bg-gray-100 p-4 rounded-lg"><code>{data.code_a}</code></pre>
        </div>
        <div className="code-block">
          <h2 className="text-2xl font-bold mb-4">Option B</h2>
          <pre className="bg-gray-100 p-4 rounded-lg"><code>{data.code_b}</code></pre>
        </div>
      </main>

      <aside className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedTools.map((tool) => (
            <div key={tool.name} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{tool.name}</h3>
              <p className="mt-2">{tool.description}</p>
              <a href={tool.url} className="text-blue-500 hover:underline mt-4 inline-block">Learn more</a>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
