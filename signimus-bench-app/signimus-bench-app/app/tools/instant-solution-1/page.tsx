'use client';

import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface BenchmarkResults {
  id?: string;
  timeA: number;
  timeB: number;
}

const InstantSolutionPage: React.FC = () => {
  const [codeA, setCodeA] = useState('// Paste your first code snippet here');
  const [codeB, setCodeB] = useState('// Paste your second code snippet here');
  const [results, setResults] = useState<BenchmarkResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setResults(null);
    setShareableLink('');

    const runSnippetInWorker = (code: string): Promise<number> => {
      return new Promise((resolve) => {
        const worker = new Worker('/benchmark-worker.js');
        worker.onmessage = (event) => {
          resolve(event.data);
          worker.terminate();
        };
        worker.postMessage({ code });
      });
    };

    const timeA = await runSnippetInWorker(codeA);
    const timeB = await runSnippetInWorker(codeB);

    const { data, error } = await supabase
      .from('results')
      .insert([{ code_a: codeA, code_b: codeB, time_a: timeA, time_b: timeB }])
      .select()
      .single();

    if (error) {
      console.error('Error saving results:', error);
    } else if (data) {
      setResults({ id: data.id, timeA, timeB });
      setShareableLink(`${window.location.origin}/results/${data.id}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="container mx-auto p-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Instant Code Benchmark</h1>
        <p className="text-xl text-gray-600">Compare the performance of two JavaScript snippets in your browser.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Snippet A</h2>
          <textarea
            className="w-full h-64 p-4 border rounded-md font-mono text-sm"
            value={codeA}
            onChange={(e) => setCodeA(e.target.value)}
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Snippet B</h2>
          <textarea
            className="w-full h-64 p-4 border rounded-md font-mono text-sm"
            value={codeB}
            onChange={(e) => setCodeB(e.target.value)}
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          onClick={handleRunBenchmark}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Benchmark'}
        </button>
      </div>

      {results && (
        <div className="mt-12 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Results</h2>
          <div className="text-center">
            <p className="text-xl mb-2">Snippet A took: <span className="font-bold">{results.timeA.toFixed(4)} ms</span></p>
            <p className="text-xl">Snippet B took: <span className="font-bold">{results.timeB.toFixed(4)} ms</span></p>
            <div className="mt-8 p-6 bg-green-100 rounded-lg">
              <h3 className="text-2xl font-bold text-green-800">
                {results.timeA < results.timeB ? 'Snippet A is faster!' : 'Snippet B is faster!'}
              </h3>
            </div>
            <div className="mt-8">
                {shareableLink && (
                    <div className="mt-8">
                        <p className="text-lg">Share your results:</p>
                        <input
                            type="text"
                            readOnly
                            value={shareableLink}
                            className="w-full p-2 mt-2 text-center border rounded-md"
                        />
                    </div>
                )}
                <p className="text-lg mt-4">Enjoy this tool? Want to save your results and access more powerful features?</p>
                <a href="/register" className="mt-4 inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300">
                    Register Now to Save Your Results
                </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstantSolutionPage;
