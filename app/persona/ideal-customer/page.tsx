import React from 'react';

const IdealCustomerPage = () => {
  return (
    <div className="container mx-auto p-8 font-sans text-gray-800">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Meet &quot;The Connector&quot;</h1>
        <p className="text-xl text-gray-600">The Driving Force Behind Efficient Resource Management</p>
      </header>

      <section className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-2 mb-6">Core Values</h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Speed and Efficiency</li>
              <li>Building Strong Relationships</li>
              <li>Meeting and Exceeding Targets</li>
              <li>Accuracy and Attention to Detail</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-2 mb-6">Primary Motivations</h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>Placing bench candidates into billable projects, fast.</li>
              <li>Hitting placement targets and earning commissions.</li>
              <li>Building a reputation for providing high-quality candidates.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-2 mb-6">Goals & Aspirations</h2>
          <p className="text-lg mb-4">
            &quot;The Connector&quot; thrives in a fast-paced environment and is always looking for ways to optimize their workflow. Their primary goal is to eliminate tedious, manual tasks so they can focus on what they do best: building relationships and closing deals.
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>To have a one-click tool that instantly sanitizes and formats resumes.</li>
            <li>To quickly share requirements with a network of trusted partners.</li>
            <li>To easily track which candidates have been submitted for which jobs.</li>
          </ul>
        </div>

        <div className="mt-12 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 pb-2 mb-6">Sound Familiar?</h2>
            <p className="text-lg">
                If this resonates with you, you&apos;re in the right place. We&apos;re building tools to eliminate the tedious, manual tasks that slow you down.
            </p>
        </div>
      </section>
    </div>
  );
};

export default IdealCustomerPage;
