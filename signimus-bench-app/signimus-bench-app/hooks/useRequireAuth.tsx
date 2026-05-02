// hooks/useRequireAuth.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext'; // Adjust the path as needed
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// A hook that redirects unauthenticated users to the home page
// Useful for components that need to enforce authentication
const useRequireAuth = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Or wherever you want to redirect unauthenticated users
    }
  }, [user, loading, router]);

  return { user, loading };
};

export default useRequireAuth;