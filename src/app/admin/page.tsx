'use client';

import DashboardPage from './dashboard/page';

export default function AdminPage() {
  
  const isAdminMode = process.env.NEXT_PUBLIC_APP_MODE === 'ADMIN';

  if (!isAdminMode) {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12 text-center">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="mt-4 text-muted-foreground">This page is for administrators only.</p>
        </div>
    )
  }
  
  return <DashboardPage />;
}
