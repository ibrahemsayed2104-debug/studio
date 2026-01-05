'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page now acts as a simple router.
// If the app is in ADMIN mode, it redirects to the dashboard.
// Otherwise, it will just stay here (or we can show an access denied message).
// The actual protection is handled within the dashboard page itself.
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual dashboard page.
    // The protection logic is now inside the dashboard page itself.
    router.replace('/admin/dashboard');
  }, [router]);

  // Render a loading state or null while redirecting
  return null; 
}
