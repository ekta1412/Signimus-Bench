// components/ProtectedRoute.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Adjust the path as needed
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login/home page
    if (!loading && !user) {
      router.push('/'); // Or wherever you want to redirect unauthenticated users
    }
  }, [user, loading, router]);

  // Show a loading indicator while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-700">Loading...</span>
      </div>
    );
  }

  // If user is authenticated, render the children
  // If not, the useEffect will handle the redirect
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;