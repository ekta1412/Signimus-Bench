// components/BenchListUploadForm.tsx
import React, { useState } from 'react';

// Define the type for a bench resource
interface BenchResource {
  name: string;
  skill: string;
  experience: number;
}

const BenchListUploadForm: React.FC = () => {
  const [benchResources, setBenchResources] = useState<BenchResource[]>([
    { name: '', skill: '', experience: 0 }
  ]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (index: number, field: keyof BenchResource, value: string) => {
    const updatedResources = [...benchResources];
    if (field === 'experience') {
      updatedResources[index][field] = parseInt(value) || 0;
    } else {
      updatedResources[index][field] = value;
    }
    setBenchResources(updatedResources);
  };

  const handleAddResource = () => {
    setBenchResources([...benchResources, { name: '', skill: '', experience: 0 }]);
  };

  const handleRemoveResource = (index: number) => {
    if (benchResources.length > 1) {
      const updatedResources = [...benchResources];
      updatedResources.splice(index, 1);
      setBenchResources(updatedResources);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage(null);

    // Filter out empty rows
    const validResources = benchResources.filter(
      resource => resource.name.trim() !== '' && resource.skill.trim() !== ''
    );

    if (validResources.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one valid bench resource.' });
      setIsUploading(false);
      return;
    }

    try {
      const response = await fetch('/api/bench-list/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ benchResources: validResources }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Bench resources uploaded successfully!' });
        // Reset form
        setBenchResources([{ name: '', skill: '', experience: 0 }]);
      } else {
        setMessage({ type: 'error', text: data.error || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Bench Resources</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {benchResources.map((resource, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-gray-200 pb-4">
            <div className="md:col-span-4">
              <label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id={`name-${index}`}
                value={resource.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resource name"
              />
            </div>
            <div className="md:col-span-4">
              <label htmlFor={`skill-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Skill
              </label>
              <input
                type="text"
                id={`skill-${index}`}
                value={resource.skill}
                onChange={(e) => handleInputChange(index, 'skill', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Skill"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor={`experience-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                id={`experience-${index}`}
                value={resource.experience}
                onChange={(e) => handleInputChange(index, 'experience', e.target.value)}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-1">
              {benchResources.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveResource(index)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleAddResource}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Add Resource
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Bench Resources'}
          </button>
        </div>
      </form>
      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default BenchListUploadForm;