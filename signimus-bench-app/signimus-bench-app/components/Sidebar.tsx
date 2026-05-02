// components/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link'; // Use next/link for Next.js pages

interface SidebarProps {
  isStaticHtml?: boolean; // Flag to indicate if it's being used in static HTML
}

const Sidebar: React.FC<SidebarProps> = ({ isStaticHtml = false }) => {
  const LinkComponent = isStaticHtml ? 'a' : Link; // Use 'a' tag for static HTML

  const links = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/bench-list', label: 'Bench List' },
    { href: '/bench-list-upload', label: 'Bench List Upload' },
    { href: '/compare', label: 'Compare' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/homepage', label: 'Homepage' },
    { href: '/job-postings', label: 'Job Postings' },
    { href: '/login', label: 'Login' },
    { href: '/persona', label: 'Persona' },
    { href: '/register', label: 'Register' },
    { href: '/results', label: 'Results' },
    { href: '/roles', label: 'Roles' },
    { href: '/skills', label: 'Skills' },
  ];

  const toolLinks = [
    { href: '/tools/instant-solution-1', label: 'Instant Solution 1' },
    { href: '/tools/job-posting', label: 'Job Posting' },
    { href: '/tools/mailing-list', label: 'Mailing List' },
    { href: '/tools/resume-formatter', label: 'Resume Formatter' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out translate-x-0 shadow-xl fixed inset-y-0 left-0 z-30 h-full p-4">
      <div className="flex items-center space-x-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L12 19.25L14.25 17L12 14.75L9.75 17Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L18.75 5.5V18.5L12 22L5.25 18.5V5.5L12 2Z" />
        </svg>
        <span className="text-xl font-bold text-gray-800">Signimus</span>
      </div>
      <nav>
        <ul className="space-y-1">
          {/* Main Section */}
          <li className="mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Main</h2>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <LinkComponent 
                    href={link.href} 
                    className="block px-4 py-2 rounded transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    {link.label}
                  </LinkComponent>
                </li>
              ))}
            </ul>
          </li>

          {/* Tools Section */}
          <li className="mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</h2>
            <ul className="space-y-1">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <LinkComponent 
                    href={link.href} 
                    className="block px-4 py-2 rounded transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    {link.label}
                  </LinkComponent>
                </li>
              ))}
            </ul>
          </li>

          {/* Check out our latest tools section */}
          <li className="mt-8 pt-4 border-t border-gray-200">
            <div className="px-4 py-2">
              <h3 className="font-semibold mb-2 text-gray-800">Check out our latest tools</h3>
              <p className="text-sm text-gray-600">
                Explore our newest features designed to boost your productivity.
              </p>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;