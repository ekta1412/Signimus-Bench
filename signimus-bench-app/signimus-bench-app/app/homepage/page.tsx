'use client';

import React from 'react';
import Link from 'next/link';

export default function Homepage() {
  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Welcome to the Bench App</h1>
        <p className="text-xl mt-4">A suite of tools to streamline your recruitment and resource management workflow.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/tools/resume-formatter">
          <a className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden group border-2 border-transparent hover:border-indigo-500 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Instant Resume Formatter</h2>
            <p className="text-slate-600 mb-4 text-sm">Remove contact information and apply your company&apos;s branding with a single click.</p>
            <span className="font-semibold text-indigo-600 group-hover:underline text-sm">Try Now &rarr;</span>
          </a>
        </Link>
        <Link href="/tools/job-posting">
          <a className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden group border-2 border-transparent hover:border-indigo-500 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Post a Job</h2>
            <p className="text-slate-600 mb-4 text-sm">Share your job requirements with our network of IT resource providers.</p>
            <span className="font-semibold text-indigo-600 group-hover:underline text-sm">Post Now &rarr;</span>
          </a>
        </Link>
        <Link href="/tools/mailing-list">
          <a className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden group border-2 border-transparent hover:border-indigo-500 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Join Our Mailing List</h2>
            <p className="text-slate-600 mb-4 text-sm">Get the latest job requirements delivered straight to your inbox.</p>
            <span className="font-semibold text-indigo-600 group-hover:underline text-sm">Subscribe Now &rarr;</span>
          </a>
        </Link>
      </div>
    </div>
  );
}