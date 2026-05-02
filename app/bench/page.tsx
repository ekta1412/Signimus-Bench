'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// TYPE
type Profile = {
  id: string;
  name: string;
  title: string;
  experience: string;
  skills: string[];
  monthlyRate: string;
  resumeLink?: string;
  marketRate?: string;
};

export default function BenchPage() {
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  const popularSkills = ['React.js', 'Python', 'Java', '.NET', 'AI/ML Engineer'];

  // API CALL
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/profiles');
      const data: Profile[] = await res.json();

      setProfiles(data);
      setFilteredProfiles(data);
    };

    fetchData();
  }, []);

  // FILTER LOGIC
  useEffect(() => {
    const filtered = profiles.filter(profile => {
      if (activeFilters.length === 0 && !jobDescription) return true;

      const matchesFilters = activeFilters.every(filter =>
        profile.skills.some(skill =>
          skill.toLowerCase().includes(filter.toLowerCase())
        )
      );

      const matchesJD = jobDescription
        ? profile.skills.some(skill =>
            jobDescription.toLowerCase().includes(skill.toLowerCase())
          ) ||
          profile.title.toLowerCase().includes(jobDescription.toLowerCase())
        : true;

      return matchesFilters && matchesJD;
    });

    setFilteredProfiles(filtered);
    setCurrentPage(1);
  }, [activeFilters, jobDescription, profiles]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleProfileSelection = (id: string) => {
    setSelectedProfiles(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setJobDescription('');
  };

  // ✅ FIXED PAGINATION (IMPORTANT ADD)
  const totalPages = Math.ceil(filteredProfiles.length / pageSize);

  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          🚀 Ekta Learning Dashboard
        </h1>

        <button
          onClick={() => router.push('/')}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Home
        </button>
      </div>

      {/* JOB DESCRIPTION */}
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description..."
        className="w-full p-3 border rounded-lg shadow mb-4 focus:outline-indigo-500"
        rows={3}
      />

      {/* FILTER TAGS */}
      <div className="flex flex-wrap gap-2 mb-3">
        {activeFilters.map(filter => (
          <span
            key={filter}
            className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm shadow"
          >
            {filter}
            <button onClick={() => toggleFilter(filter)} className="ml-2">
              ×
            </button>
          </span>
        ))}

        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-600 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* SKILLS BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {popularSkills.map(skill => (
          <button
            key={skill}
            onClick={() => toggleFilter(skill)}
            className="bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 transition"
          >
            {skill}
          </button>
        ))}
      </div>

      {/* PROFILE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {paginatedProfiles.map(profile => {
          const isSelected = selectedProfiles.includes(profile.id);

          return (
            <div
              key={profile.id}
              onClick={() => toggleProfileSelection(profile.id)}
              className={`rounded-xl p-5 cursor-pointer transition transform hover:scale-105 shadow-md border
              ${isSelected
                ? 'bg-indigo-100 border-indigo-500'
                : 'bg-white hover:shadow-xl'
              }`}
            >
              <h2 className="text-lg font-bold text-indigo-700">
                {profile.name}
              </h2>

              <p className="text-gray-600 font-medium">
                {profile.title}
              </p>

              <p className="text-sm text-gray-500 mb-2">
                ⏱ {profile.experience}
              </p>

              <div className="flex flex-wrap gap-1">
                {profile.skills.slice(0, 5).map(skill => (
                  <span
                    key={skill}
                    className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-sm font-semibold text-green-600">
                💰 ₹{profile.monthlyRate}
              </p>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-medium">
          {currentPage} / {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* SELECTED BAR */}
      {selectedProfiles.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-700 text-white p-4 flex justify-between shadow-lg">
          <span>✔ {selectedProfiles.length} Selected</span>

          <div className="space-x-2">
            <button className="bg-green-500 px-3 py-1 rounded">
              Copy
            </button>
            <button className="bg-blue-500 px-3 py-1 rounded">
              Interview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}