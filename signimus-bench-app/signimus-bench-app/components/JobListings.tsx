// components/JobListings.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Define the type for a job posting
interface JobPosting {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  job_description: string;
  created_at: string;
}

const JobListings: React.FC = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await fetch('/api/job-postings');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: JobPosting[] = await response.json();
        setJobPostings(data);
      } catch (err) {
        console.error('Error fetching job postings:', err);
        setError('Failed to load job postings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-700">Loading job postings...</span>
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Job Postings</h2>
      {jobPostings.length === 0 ? (
        <p className="text-gray-600">No job postings found.</p>
      ) : (
        <div className="space-y-6">
          {jobPostings.map((job) => (
            <Link key={job.id} href={`/job-postings/${job.id}`} className="block">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.job_title}</h3>
                    <p className="text-lg text-gray-700">{job.company_name}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  <span className="font-medium">Location:</span> {job.location}
                </p>
                <div className="mt-4">
                  <p className="font-medium text-gray-900">Job Description:</p>
                  <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                    {job.job_description.length > 200 
                      ? `${job.job_description.substring(0, 200)}...` 
                      : job.job_description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;