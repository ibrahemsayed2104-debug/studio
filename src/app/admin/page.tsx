'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;

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
    if (!newStatus || !firestore) return;

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
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>رقم الطلب</TableHead>
                            <TableHead>العميل</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الحالة الحالية</TableHead>
                            <TableHead className="w-[350px]">تغيير الحالة</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Select value={updatingStatus[order.id]} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="اختر حالة" />
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
                                            size="sm"
                                        >
                                            {updatingId === order.id ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : 'تحديث'}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
