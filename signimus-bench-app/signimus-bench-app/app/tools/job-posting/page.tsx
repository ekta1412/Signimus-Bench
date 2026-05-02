'use client';

import React from 'react';
import JobPostingForm from '../../../components/JobPostingForm'; // Adjust the path as needed

export default function JobPostingPage() {
  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Post a New Job Requirement</h1>
        <p className="text-xl mt-4">Share your job requirements with our network of IT resource providers.</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <JobPostingForm />
      </div>
    </div>
  );
}