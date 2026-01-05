'use client';

import { ShieldOff } from 'lucide-react';
import DashboardPage from './dashboard/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  // This is the correct way to protect the admin route.
  // It checks the environment variable to determine if the app is in "ADMIN" mode.
  if (process.env.NEXT_PUBLIC_APP_MODE === 'ADMIN') {
    return <DashboardPage />;
  }

  // If not in ADMIN mode, show an access denied message.
  // This is crucial for security when the app is deployed for customers.
  return (
      <div className="container mx-auto max-w-2xl px-4 py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full text-center bg-destructive/10 border-destructive">
            <CardHeader>
                <div className="mx-auto bg-destructive/20 rounded-full p-4 w-fit">
                    <ShieldOff className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="text-3xl font-headline mt-4 text-destructive-foreground">
                    الوصول مرفوض
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-lg !text-destructive-foreground/80">
                    هذه الصفحة متاحة للمدير فقط.
                </CardDescription>
            </CardContent>
        </Card>
    </div>
  );
}
