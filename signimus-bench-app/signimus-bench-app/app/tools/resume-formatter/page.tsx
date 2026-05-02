'use client';

import React, { useState } from 'react';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import { TextContentItem } from 'pdfjs-dist/types/src/display/api';
import templates from '../../../lib/resume-templates.json';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ResumeFormatterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedText, setProcessedText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleProcessResume = async () => {
    if (!file) {
      alert('Please select a file to process.');
      return;
    }

    setIsProcessing(true);
    setProcessedText('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer) {
        let text = '';
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
          text = result.value;
        } else if (file.type === 'application/pdf') {
          const pdf = await pdfjs.getDocument(arrayBuffer as ArrayBuffer).promise;
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: TextContentItem) => item.str).join(' ');
          }
        }

        const sanitizedText = text
          .replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '[EMAIL REMOVED]')
          .replace(/(\+\d{1,3}[- ]?)?\d{10}/g, '[PHONE REMOVED]')
          .replace(/linkedin\.com\/in\/[\w-]+/g, '[LINKEDIN REMOVED]');

        setProcessedText(sanitizedText);
      }
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Instant Resume Formatter</h1>
        <p className="text-xl mt-4">Remove contact information and apply your company&apos;s branding with a single click.</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleProcessResume}
            disabled={isProcessing || !file}
            className="mt-8 bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Process Resume'}
          </button>
        </div>
        {processedText && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Processed Resume</h2>
            <div className="mb-4">
              <label htmlFor="template" className="block text-lg font-medium mb-2">Select a Template</label>
              <select
                id="template"
                onChange={(e) => setSelectedTemplate(templates.find(t => t.name === e.target.value) || templates[0])}
                className="w-full p-4 border rounded-md"
              >
                {templates.map(template => (
                  <option key={template.name} value={template.name}>{template.name}</option>
                ))}
              </select>
            </div>
            <textarea
              readOnly
              value={processedText}
              className="w-full h-96 p-4 border rounded-md"
              style={selectedTemplate.styles}
            />
            <div className="mt-8 text-center">
                <p className="text-lg">Like your new template?</p>
                <a href="/register" className="mt-4 inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300">
                    Register Now to Save Your Custom Templates
                </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}