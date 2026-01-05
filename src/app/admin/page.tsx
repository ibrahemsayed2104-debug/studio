'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect from the base /admin to the dashboard.
    // The dashboard is the single entry point for admins.
    router.replace('/admin/dashboard');
  }, [router]);

  // Render a loading state or null while redirecting
  return null; 
}
