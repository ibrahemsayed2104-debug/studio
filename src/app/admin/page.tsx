'use client';

import DashboardPage from './dashboard/page';

export default function AdminPage() {
  
  const isAdminMode = process.env.NEXT_PUBLIC_APP_MODE === 'ADMIN';

  if (!isAdminMode) {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-12 md:py-20 text-center">
            <h1 className="text-4xl font-bold text-destructive">الوصول مرفوض</h1>
            <p className="mt-4 text-muted-foreground text-lg">
              هذه الصفحة مخصصة للمسؤولين فقط. لا يمكنك الوصول إلى هذا المحتوى.
            </p>
        </div>
    )
  }
  
  return <DashboardPage />;
}
