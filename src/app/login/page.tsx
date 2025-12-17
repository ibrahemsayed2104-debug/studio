'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect users away from this page
    router.replace('/');
  }, [router]);

  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
       <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">تم تعطيل تسجيل الدخول</CardTitle>
          <CardDescription>
            لقد تم تعطيل ميزة تسجيل الدخول. يمكنك متابعة التسوق مباشرة.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
