import pseoData from '../../../lib/pseo-data.json';
import InstantSolutionPage from '../../tools/instant-solution-1/page';



export async function generateStaticParams() {
  return pseoData.map((item) => ({
    slug: item.slug,
  }));
}

interface ComparePageProps {
  params: {
    slug: string;
  };
}

export default function ComparePage({ params }: ComparePageProps) {
  const { slug } = params;
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
      
    </div>
  );
}