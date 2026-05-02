'use client';

import React, { useState } from 'react';

export default function JobPostingPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [notifyOnResumeSubmission, setNotifyOnResumeSubmission] = useState(false);

  const handlePostJob = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPosting(true);

    try {
      const response = await fetch('/api/job-posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          companyName,
          location,
          jobDescription,
          notifyOnResumeSubmission,
        }),
      });

      if (response.ok) {
        setIsPosted(true);
        // Optionally clear form fields
        setJobTitle('');
        setCompanyName('');
        setLocation('');
        setJobDescription('');
        setNotifyOnResumeSubmission(false);
      } else {
        const errorData = await response.json();
        alert(`Job posting failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during job posting:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Post a New Job Requirement</h1>
        <p className="text-xl mt-4">Share your job requirements with our network of IT resource providers.</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Enter Job Details</h2>
        {isPosted ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600">Job Posted Successfully!</h2>
            <p className="text-lg mt-4">Your job requirement has been shared with our network.</p>
          </div>
        ) : (
          <form onSubmit={handlePostJob} className="px-8 pb-8">
            <div className="mb-6">
              <label htmlFor="jobTitle" className="block text-lg font-medium mb-2">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full p-4 border rounded-md"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="companyName" className="block text-lg font-medium mb-2">Company Name</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full p-4 border rounded-md"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="location" className="block text-lg font-medium mb-2">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-4 border rounded-md"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="jobDescription" className="block text-lg font-medium mb-2">Job Description</label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                className="w-full p-4 border rounded-md h-48"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="subscribe" className="flex items-center">
                <input
                  type="checkbox"
                  id="subscribe"
                  checked={notifyOnResumeSubmission}
                  onChange={(e) => setNotifyOnResumeSubmission(e.target.checked)}
                  className="mr-2"
                />
                <span>Notify me when resumes are submitted for this job.</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isPosting}
              className="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              {isPosting ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}