'use client';

import { ShieldOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  // This page now serves as a public-facing block.
  // The actual dashboard is located at /admin/dashboard.
  // This prevents customers from easily accessing the main management area,
  // while allowing the admin to have a direct, reliable link.
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
                    هذه الصفحة غير متاحة.
                </CardDescription>
            </CardContent>
        </Card>
    </div>
  );
}
