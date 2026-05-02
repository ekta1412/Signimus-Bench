// app/bench-list-upload/page.tsx
'use client';

import React from 'react';
import BenchList from '../../components/BenchList';
import BenchListUploadForm from '../../components/BenchListUploadForm';
import BenchListCSVUpload from '../../components/BenchListCSVUpload';

const BenchListUploadPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">Bench Resources Management</h1>
        <p className="text-lg mt-2">Upload and view bench resources</p>
      </header>

      <div className="mb-12">
        <BenchListUploadForm />
      </div>

      <div className="mb-12">
        <BenchListCSVUpload />
      </div>

      <div className="mt-12">
        <BenchList />
      </div>
    </div>
  );
};

export default BenchListUploadPage;