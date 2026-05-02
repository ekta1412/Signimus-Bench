import { supabase } from '../../../lib/supabase';

interface ResultsPageProps {
  params: {
    id: string;
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = params;
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Result not found</h1>
        <p className="text-lg mt-4">The benchmark result you are looking for could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Benchmark Results</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Snippet A</h2>
          <pre className="w-full h-64 p-4 border rounded-md font-mono text-sm overflow-auto">
            <code>{data.code_a}</code>
          </pre>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Snippet B</h2>
          <pre className="w-full h-64 p-4 border rounded-md font-mono text-sm overflow-auto">
            <code>{data.code_b}</code>
          </pre>
        </div>
      </div>

      <div className="mt-12 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">Results</h2>
        <div className="text-center">
          <p className="text-xl mb-2">Snippet A took: <span className="font-bold">{data.time_a.toFixed(4)} ms</span></p>
          <p className="text-xl">Snippet B took: <span className="font-bold">{data.time_b.toFixed(4)} ms</span></p>
          <div className="mt-8 p-6 bg-green-100 rounded-lg">
            <h3 className="text-2xl font-bold text-green-800">
              {data.time_a < data.time_b ? 'Snippet A is faster!' : 'Snippet B is faster!'}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}