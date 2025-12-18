'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PackageSearch, AlertCircle, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

const ORDER_STATUSES = ['قيد المعالجة', 'تم الشحن', 'تم التوصيل', 'تم استلام الطلب', 'ملغي'];

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    const ordersRef = collection(firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderData));
        setOrders(fetchedOrders);
        const initialStatus: Record<string, string> = {};
        fetchedOrders.forEach(order => {
          initialStatus[order.id] = order.status;
        });
        setUpdatingStatus(initialStatus);
        setIsLoading(false);
      },
      (err) => {
        console.error(err);
        setError('حدث خطأ أثناء جلب الطلبات. قد تكون بسبب قيود الأمان.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore]);

  const handleUpdateStatus = async (orderId: string) => {
    const newStatus = updatingStatus[orderId];
    if (!newStatus) return;

    setUpdatingId(orderId);
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast({
        title: 'تم تحديث الحالة',
        description: `تم تحديث حالة الطلب #${orderId.slice(-4)} إلى "${newStatus}".`,
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'خطأ في التحديث',
        description: 'لم نتمكن من تحديث حالة الطلب. الرجاء المحاولة مرة أخرى.',
      });
    } finally {
      setUpdatingId(null);
    }
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'تم التوصيل':
      case 'تم استلام الطلب':
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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setUpdatingStatus(prev => ({ ...prev, [orderId]: newStatus }));
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          لوحة تحكم الطلبات
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          عرض وإدارة جميع الطلبات الواردة من هنا.
        </p>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground py-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4">جاري تحميل الطلبات...</p>
        </div>
      )}

      {error && !isLoading && (
         <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center text-muted-foreground py-20 max-w-lg mx-auto border-2 border-dashed rounded-lg">
            <ShoppingBag className="h-16 w-16 mx-auto" />
            <h3 className="mt-6 text-2xl font-headline">لا توجد طلبات بعد</h3>
            <p className="mt-2 max-w-xs mx-auto">عندما يقوم العميل بإجراء طلب جديد، سيظهر هنا.</p>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle>جميع الطلبات ({orders.length})</CardTitle>
                <CardDescription>هذه هي قائمة بجميع الطلبات التي تم استلامها.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {orders.map(order => (
                        <AccordionItem value={order.id} key={order.id}>
                            <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-4 rounded-md">
                                <div className="flex flex-1 items-center justify-between gap-4">
                                    <div className="text-right">
                                        <p className="font-bold">#{order.id.slice(-6)}</p>
                                        <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                                    </div>
                                    <div className="text-center">
                                       <Badge variant={getStatusVariant(order.status)} className="text-sm">{order.status}</Badge>
                                    </div>
                                    <div className="text-left text-sm text-muted-foreground">
                                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-muted/20 border-b">
                                 <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">ملخص الطلب ({order.itemCount})</h4>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.productName} (x{item.quantity})</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.customization.fabric}, {item.customization.size}, {item.customization.color}, {item.customization.style}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">معلومات الشحن</h4>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p><span className="font-medium text-foreground">الاسم:</span> {order.customer.name}</p>
                                            <p><span className="font-medium text-foreground">العنوان:</span> {order.customer.address}</p>
                                            <p><span className="font-medium text-foreground">رقم الهاتف:</span> {order.customer.phone}</p>
                                        </div>
                                    </div>
                                     <Separator />
                                     <div className="space-y-2">
                                        <h4 className="font-semibold">تحديث حالة الطلب</h4>
                                        <div className="flex flex-col sm:flex-row gap-2 items-center">
                                            <Select value={updatingStatus[order.id]} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                                                <SelectTrigger className="w-full sm:w-[200px]">
                                                    <SelectValue placeholder="اختر حالة جديدة" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                {ORDER_STATUSES.map(status => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <Button 
                                                onClick={() => handleUpdateStatus(order.id)} 
                                                disabled={updatingId === order.id || order.status === updatingStatus[order.id]} 
                                                className="w-full sm:w-auto"
                                            >
                                                {updatingId === order.id && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
                                                تحديث الحالة
                                            </Button>
                                        </div>
                                     </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
