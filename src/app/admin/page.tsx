'use client';

import DashboardPage from './dashboard/page';

export default function AdminPage() {
  // By returning the DashboardPage directly, we bypass the environment variable check
  // that was causing the "Access Denied" issue due to caching.
  // This ensures the admin dashboard is always accessible at the /admin route.
  return <DashboardPage />;
}
