'use client';

import React, { useState } from 'react';

export default function MailingListPage() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubscribing(true);

    try {
      const response = await fetch('/api/mailing-list/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        const errorData = await response.json();
        alert(`Subscription failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during subscription:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Subscribe to New Job Requirements</h1>
        <p className="text-xl mt-4">Be the first to know when new job requirements are posted on our platform.</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {isSubscribed ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600">Thank you for subscribing!</h2>
            <p className="text-lg mt-4">You will now receive email notifications for new job requirements.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="text-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full p-4 border rounded-md"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="mt-8 bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}