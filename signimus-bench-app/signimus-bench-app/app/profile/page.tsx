// app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Adjust the path as needed
import useRequireAuth from '@/hooks/useRequireAuth'; // Adjust the path as needed

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useRequireAuth();
  const { session } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    // Add other profile fields as needed
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Populate profile data when user is available
    if (user) {
      setProfileData({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        // Map other user metadata fields as needed
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;

    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      // Update user metadata in Supabase
      const { data, error } = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(profileData),
      }).then(res => res.json());

      if (error) {
        throw new Error(error.message);
      }

      setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Optionally, refresh the user data from Supabase
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Show a loading indicator while checking auth status
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-700">Loading profile...</span>
      </div>
    );
  }

  // If user is not authenticated, useRequireAuth will redirect
  // So we can safely assume user is available here
  if (!user) {
    return null; // This should never be reached due to useRequireAuth redirect
  }

  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">User Profile</h1>
        <p className="text-lg mt-2">Manage your account information</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              disabled // Email is typically not editable directly
            />
            <p className="mt-1 text-sm text-gray-500">Email address cannot be changed.</p>
          </div>
          {/* Add other profile fields as needed */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isUpdating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        {updateMessage && (
          <div
            className={`mt-4 p-3 rounded-md ${
              updateMessage.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {updateMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;