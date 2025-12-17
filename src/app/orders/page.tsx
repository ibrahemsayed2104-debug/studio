'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [firestore, user]);

  const { data: orders, isLoading: areOrdersLoading, error } = useCollection(ordersQuery);

  if (isUserLoading) {
    return <div className="container text-center py-20">جاري تحميل...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12 text-center">
        <Card>
          <CardHeader>
            <LogIn className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">الوصول مطلوب</CardTitle>
            <CardDescription>
              الرجاء تسجيل الدخول لعرض محفوظات طلباتك.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login?redirect=/orders">تسجيل الدخول</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    if (areOrdersLoading) {
      return <div className="text-center p-8">جاري تحميل طلباتك...</div>;
    }

    if (error) {
       return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>
            حدث خطأ أثناء جلب طلباتك. الرجاء المحاولة مرة أخرى لاحقًا.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!orders || orders.length === 0) {
        return <div className="text-center p-8">لم تقم بأي طلبات بعد.</div>;
    }


    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الطلب</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">المنتجات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id.substring(0,6)}</TableCell>
              <TableCell>{new Date(order.orderDate).toLocaleDateString('ar-SA')}</TableCell>
              <TableCell>
                 <Badge 
                    variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                    className={
                      order.status === 'Delivered' ? 'bg-green-600/80 text-white' : 
                      order.status === 'Shipped' ? 'bg-blue-500/80 text-white' : ''
                    }
                  >
                    {order.status === 'Delivered' ? 'تم التوصيل' : order.status === 'Shipped' ? 'تم الشحن' : 'قيد المعالجة'}
                  </Badge>
              </TableCell>
              <TableCell className="text-left">{order.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          طلباتي
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          عرض محفوظات طلباتك وتتبع حالة طلباتك الحالية.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>محفوظات الطلبات</CardTitle>
          <CardDescription>قائمة بجميع طلباتك.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
