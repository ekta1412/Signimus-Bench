// app/job-postings/page.tsx
'use client';

import React from 'react';
import JobListings from '../../components/JobListings';
import Link from 'next/link';

export default function JobPostingsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-12">
        <header>
          <h1 className="text-4xl font-bold">Job Postings</h1>
          <p className="text-xl mt-2 text-gray-600">Browse available job opportunities</p>
        </header>
        <Link 
          href="/tools/job-posting" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Post a New Job
        </Link>
      </div>

      <JobListings />
    </div>
  );
}