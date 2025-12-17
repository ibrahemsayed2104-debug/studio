'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function OrdersPage() {

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
       <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          طلباتي
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          عرض محفوظات طلباتك وتتبع حالة طلباتك الحالية.
        </p>
      </div>
      <Card className="text-center">
        <CardHeader>
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <CardTitle className="mt-4">ميزة تتبع الطلبات غير متاحة حالياً</CardTitle>
          <CardDescription>
            لقد تم تعطيل نظام تسجيل الدخول، وبالتالي لا يمكن عرض الطلبات السابقة.
            لتتبع طلبك، يرجى التواصل معنا مباشرة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/contact">تواصل معنا</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
