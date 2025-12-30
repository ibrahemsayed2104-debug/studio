'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardPage from './dashboard/page';
import AdminLoginPage from './login/page';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('admin-auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('admin-auth', 'true');
    setIsAuthenticated(true);
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardPage />;
  }

  return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
}
