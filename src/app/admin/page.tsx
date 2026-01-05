'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to the dashboard. The dashboard page itself
    // is now the single point of entry for admins.
    router.replace('/admin/dashboard');
  }, [router]);

  // Render a loading state or null while redirecting
  return null; 
}
