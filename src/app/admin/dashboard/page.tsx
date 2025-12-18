'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ShoppingBag, Truck, CheckCircle, PackageOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

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

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);


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
        setStatusMap(initialStatus);
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

  const handleUpdateStatus = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dialog from opening when clicking the button
    const newStatus = statusMap[orderId];
    if (!newStatus || !firestore) return;

    setUpdatingId(orderId);
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast({
        title: 'تم تحديث الحالة',
        description: `تم تحديث حالة الطلب #${orderId.slice(-6)} إلى "${newStatus}".`,
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
        return 'default'; // Green
      case 'تم الشحن':
        return 'secondary'; // Gray
      case 'قيد المعالجة':
        return 'outline'; // Yellowish/brownish
       case 'ملغي':
        return 'destructive'; // Red
      default:
        return 'outline';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'تم التوصيل':
      case 'تم استلام الطلب':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'تم الشحن':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'قيد المعالجة':
        return <PackageOpen className="h-5 w-5 text-yellow-500" />;
      case 'ملغي':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <PackageOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatusMap(prev => ({ ...prev, [orderId]: newStatus }));
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
         <Dialog>
            <Card>
                <CardHeader>
                    <CardTitle>جميع الطلبات ({orders.length})</CardTitle>
                    <CardDescription>انقر على أي طلب لعرض تفاصيله الكاملة.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">رقم الطلب</TableHead>
                                    <TableHead className="text-right">العميل</TableHead>
                                    <TableHead className="text-right">التاريخ</TableHead>
                                    <TableHead className="text-right">الحالة الحالية</TableHead>
                                    <TableHead className="text-right w-[350px]">تغيير الحالة</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map(order => (
                                    <DialogTrigger key={order.id} asChild>
                                        <TableRow onClick={() => setSelectedOrder(order)} className="cursor-pointer">
                                            <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                                            <TableCell>{order.customer.name}</TableCell>
                                            <TableCell>{new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                            </TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <Select value={statusMap[order.id]} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
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
                                                        onClick={(e) => handleUpdateStatus(order.id, e)}
                                                        disabled={updatingId === order.id || order.status === statusMap[order.id]}
                                                        size="sm"
                                                    >
                                                        {updatingId === order.id ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : 'تحديث'}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </DialogTrigger>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {selectedOrder && (
                 <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-headline flex items-center gap-4">
                            تفاصيل الطلب 
                            <span className="font-mono text-base bg-muted px-2 py-1 rounded">#{selectedOrder.id.slice(-6)}</span>
                        </DialogTitle>
                         <DialogDescription>
                            تم إنشاء الطلب في: {new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString('ar-EG')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            {getStatusIcon(selectedOrder.status)}
                            <span className="font-semibold">الحالة الحالية:</span>
                            <Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                        </div>
                        
                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-2 font-headline">معلومات العميل</h3>
                            <div className="text-sm space-y-1 text-muted-foreground">
                                <p><strong className="text-foreground">الاسم:</strong> {selectedOrder.customer.name}</p>
                                <p><strong className="text-foreground">رقم الهاتف:</strong> {selectedOrder.customer.phone}</p>
                                <p><strong className="text-foreground">العنوان:</strong> {selectedOrder.customer.address}</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-2 font-headline">المنتجات المطلوبة ({selectedOrder.itemCount})</h3>
                            <div className="space-y-4">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="p-3 border rounded-md bg-background">
                                        <p className="font-medium text-foreground">{item.productName} (الكمية: {item.quantity})</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                           <strong>التخصيص:</strong> {item.customization.fabric}, {item.customization.size}, {item.customization.color}, {item.customization.style}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            )}
         </Dialog>
      )}
    </div>
  );
}
