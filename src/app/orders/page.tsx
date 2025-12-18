'use client';

import { useState } from 'react';
import { doc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PackageSearch, AlertCircle, ShoppingBag, CheckCircle, PackageCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


interface OrderData extends DocumentData {
  id: string;
  status: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    customization: {
      fabric: string;
      size: string;
      color: string;
      style: string;
    };
  }[];
  itemCount: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function OrdersPage() {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError('الرجاء إدخال رقم الطلب.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const orderRef = doc(firestore, 'orders', orderId.trim());
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const data = orderSnap.data() as OrderData;
        data.id = orderSnap.id;
        setOrder(data);
      } else {
        setError('لم يتم العثور على طلب بهذا الرقم. يرجى التحقق مرة أخرى.');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء جلب الطلب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReception = async () => {
    if (!order) return;

    setIsUpdating(true);
    const orderRef = doc(firestore, 'orders', order.id);
    const updatedData = { status: 'تم التوصيل' };

    try {
      // Non-blocking update
      updateDoc(orderRef, updatedData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: orderRef.path,
            operation: 'update',
            requestResourceData: updatedData,
          });
          errorEmitter.emit('permission-error', permissionError);
          // We don't re-throw, just show a toast
           toast({
            variant: "destructive",
            title: "خطأ في التحديث",
            description: "ليس لديك الصلاحية لتغيير حالة الطلب.",
          });
        });
        
      // Optimistic UI update
      setOrder(prevOrder => prevOrder ? { ...prevOrder, status: 'تم التوصيل' } : null);
      
      toast({
        title: "تم تأكيد الاستلام!",
        description: "شكرًا لك! سعداء بخدمتك.",
      });

    } catch (err) {
      console.error("Error updating order status:", err);
       toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث حالة الطلب. الرجاء المحاولة مرة أخرى.",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getProductImage = (productId: string) => {
    return PRODUCTS.find(p => p.id === productId)?.image || '';
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'تم التوصيل':
        return 'default';
      case 'تم الشحن':
        return 'secondary';
      case 'قيد المعالجة':
        return 'outline';
       case 'ملغي':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          تتبع طلبك
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          أدخل رقم طلبك أدناه لمعرفة حالته وتفاصيله.
        </p>
      </div>

      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>أدخل رقم الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="مثال: order_1699982042468"
              className="flex-grow"
            />
            <Button onClick={handleTrackOrder} disabled={isLoading}>
              {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <PackageSearch className="ms-2 h-4 w-4" />}
              تتبع
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        {isLoading && (
          <div className="text-center text-muted-foreground py-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4">جاري البحث عن طلبك...</p>
          </div>
        )}

        {error && !isLoading && (
           <Alert variant="destructive" className="max-w-lg mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && order && (
           <Card className="max-w-3xl mx-auto animate-in fade-in-50 duration-500">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">تفاصيل الطلب</CardTitle>
                        <CardDescription>رقم الطلب: {order.id}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(order.status)} className="text-sm">{order.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Separator />
                <div className="space-y-4">
                    <h3 className="font-semibold">ملخص الطلب</h3>
                     {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                <Image src={getProductImage(item.productId)} alt={item.productName} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                                <p className="text-xs text-muted-foreground">
                                    {item.customization.fabric}, {item.customization.size}, {item.customization.color}, {item.customization.style}
                                </p>
                            </div>
                        </div>
                     ))}
                </div>
                 <Separator />
                <div className="space-y-4">
                    <h3 className="font-semibold">معلومات الشحن</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium text-foreground">الاسم:</span> {order.customer.name}</p>
                        <p><span className="font-medium text-foreground">العنوان:</span> {order.customer.address}</p>
                        <p><span className="font-medium text-foreground">رقم الهاتف:</span> {order.customer.phone}</p>
                    </div>
                </div>
            </CardContent>
            {order.status === 'تم الشحن' && (
              <CardFooter className="flex-col items-stretch gap-4 border-t pt-6">
                <Alert>
                  <PackageCheck className="h-4 w-4" />
                  <AlertTitle>هل استلمت طلبك؟</AlertTitle>
                  <AlertDescription>
                    بالضغط على الزر أدناه، أنت تؤكد استلامك للطلب.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleConfirmReception} disabled={isUpdating} className="w-full font-bold">
                  {isUpdating ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <CheckCircle className="ms-2 h-4 w-4" />}
                  تأكيد الاستلام
                </Button>
              </CardFooter>
            )}
            {order.status === 'تم التوصيل' && (
                <CardFooter className="border-t pt-6">
                    <div className="text-center w-full text-green-600 flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="font-medium">تم توصيل هذا الطلب بنجاح.</p>
                    </div>
                </CardFooter>
            )}
           </Card>
        )}
        
         {!isLoading && !error && !order && (
            <div className="text-center text-muted-foreground py-10 max-w-lg mx-auto">
                <ShoppingBag className="h-16 w-16 mx-auto" />
                <p className="mt-4 max-w-xs mx-auto">ستظهر تفاصيل طلبك هنا بعد البحث.</p>
            </div>
          )}
      </div>
    </div>
  );
}
