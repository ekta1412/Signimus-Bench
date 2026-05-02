// app/job-postings/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the type for a job posting
interface JobPosting {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  job_description: string;
  created_at: string;
}

const JobPostingDetailPage: React.FC = () => {
  const router = useRouter();
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you would get the ID from the URL params
  // For now, we'll simulate this with a placeholder
  const jobId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    const fetchJobPosting = async () => {
      if (!jobId) return;
      
      try {
        const response = await fetch(`/api/job-postings/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: JobPosting = await response.json();
        setJobPosting(data);
      } catch (err) {
        console.error('Error fetching job posting:', err);
        setError('Failed to load job posting. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosting();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-700">Loading job posting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!jobPosting) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found! </strong>
          <span className="block sm:inline">Job posting not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <button 
        onClick={() => router.back()} 
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Back to Job Postings
      </button>
      
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{jobPosting.job_title}</h1>
            <p className="text-xl text-gray-700 mt-2">{jobPosting.company_name}</p>
          </div>
          <span className="text-sm text-gray-500">
            Posted on {new Date(jobPosting.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Location</h2>
          <p className="text-gray-600">{jobPosting.location}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap">{jobPosting.job_description}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Apply for this Position
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetailPage;