'use client';

import React from 'react';
import MailingListForm from '../../../components/MailingListForm'; // Adjust the path as needed

export default function MailingListPage() {
  return (
    <div className="container mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold">Subscribe to New Job Requirements</h1>
        <p className="text-xl mt-4">Be the first to know when new job requirements are posted on our platform.</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <MailingListForm />
      </div>
    </div>
  );
}