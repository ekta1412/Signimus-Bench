// app/tools/job-reach-estimator/page.tsx
"use client";

import React, { useState } from 'react';

const JobReachEstimatorPage: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [estimatedReach, setEstimatedReach] = useState<number | null>(null);

  const industries = ['Technology', 'Healthcare', 'Finance', 'Marketing', 'Education', 'Other'];
  const experienceLevels = ['Junior', 'Mid', 'Senior'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple dummy estimation logic
    let reach = 0;
    if (industry === 'Technology' && experienceLevel === 'Senior') {
      reach = 10000;
    } else if (industry === 'Healthcare' && experienceLevel === 'Mid') {
      reach = 7000;
    } else if (role.toLowerCase().includes('manager')) {
      reach = 5000;
    } else {
      reach = 2000;
    }
    setEstimatedReach(reach);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Post Reach Estimator</h2>
      <p className="mb-6 text-gray-600">Estimate the potential reach of your job posting.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select an Industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role (e.g., Software Engineer, Nurse, Marketing Manager)
          </label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Engineer"
            required
          />
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Experience Level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-700"
        >
          Estimate Reach
        </button>
      </form>

      {estimatedReach !== null && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 text-center">
          <p className="text-lg font-semibold">Estimated Reach:</p>
          <p className="text-3xl font-bold mt-2">{estimatedReach.toLocaleString()} candidates</p>
          <p className="text-sm mt-2 text-gray-600">
            This is an estimation based on our network. Post your job to reach real candidates!
          </p>
        </div>
      )}
    </div>
  );
};

export default JobReachEstimatorPage;
