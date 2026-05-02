'use client';

import React from 'react';
import BenchList from '../../components/BenchList'; // Adjust the path as needed
import Link from 'next/link';

export default function BenchListPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Bench Resources</h1>
        <Link 
          href="/bench-list-upload" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Upload Bench Resources
        </Link>
      </div>
      <BenchList />
    </div>
  );
}