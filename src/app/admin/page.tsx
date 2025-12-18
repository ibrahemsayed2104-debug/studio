import DashboardPage from './dashboard/page';

// This is a wrapper component to render the protected dashboard.
// The actual protection is handled by the middleware.
export default function AdminPage() {
  return <DashboardPage />;
}
