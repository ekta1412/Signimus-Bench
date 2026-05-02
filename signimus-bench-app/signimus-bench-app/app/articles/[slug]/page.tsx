import fs from 'fs';
import path from 'path';

interface PseoArticle {
  slug: string;
  title: string;
  description: string;
  code_a: string;
  code_b: string;
}

// Function to read pSEO data
function getPseoData(): PseoArticle[] {
  const filePath = path.join(process.cwd(), 'signimus-bench-app/signimus-bench-app/lib/pseo-data.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

// Generate static params for all pSEO articles
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const pseoData = getPseoData();
  return pseoData.map((article) => ({
    slug: article.slug,
  }));
}

export default function PseoArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const pseoData = getPseoData();
  const article = pseoData.find((item) => item.slug === slug);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">{article.title}</h1>
        <p className="text-xl mt-4">{article.description}</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Code Example A:</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto mb-6">
          <code>{article.code_a}</code>
        </pre>

        <h2 className="text-2xl font-bold mb-4">Code Example B:</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
          <code>{article.code_b}</code>
        </pre>
      </div>
    </div>
  );
}
