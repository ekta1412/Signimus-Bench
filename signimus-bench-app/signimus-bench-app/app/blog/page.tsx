'use client';

import React from 'react';

export default function BlogPage() {
  const posts = [
    { id: 1, title: 'The Art of the Bench: How to Keep Your Team Engaged', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, title: 'Top 5 Skills to Look for in Your Next Hire', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 3, title: 'How to Build a Winning Team Culture', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ];

  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Blog</h1>
        <p className="text-xl mt-4">Insights and best practices for IT resource management.</p>
      </header>

      <div className="max-w-4xl mx-auto">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <a href="#" className="text-blue-500 hover:underline mt-4 inline-block">Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
}