// components/MailingListForm.tsx
import React, { useState } from 'react';

const MailingListForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false); // New state for share link visibility
  const [copySuccess, setCopySuccess] = useState(''); // New state for copy success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setShowShareLink(false); // Hide share link on new submission

    try {
      const response = await fetch('/api/mailing-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Subscription successful!' });
        setEmail(''); // Clear the input field
        setShowShareLink(true); // Show share link on successful subscription
      } else {
        setMessage({ type: 'error', text: data.error || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      })
      .catch((err) => {
        setCopySuccess('Failed to copy!');
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Subscribe to our Mailing List</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
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

      {showShareLink && message?.type === 'success' && ( // Only show if subscription was successful
        <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-100 text-blue-800">
          <p className="font-medium mb-2">Share this page with your network!</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="flex-grow px-3 py-2 border border-blue-300 rounded-md bg-blue-100 text-blue-800 text-sm"
            />
            <button
              onClick={handleCopyClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {copySuccess || 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailingListForm;
