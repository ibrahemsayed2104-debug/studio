
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ShoppingBag, Truck, CheckCircle, PackageOpen, MessagesSquare, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface ContactRequestData extends DocumentData {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  status: string;
}


const ORDER_STATUSES = ['قيد المعالجة', 'تم الشحن', 'تم التوصيل', 'تم استلام الطلب', 'ملغي'];
const CONTACT_STATUSES = ['جديد', 'تم التواصل', 'مغلق'];

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequestData[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [isContactsLoading, setIsContactsLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [orderStatusMap, setOrderStatusMap] = useState<Record<string, string>>({});
  const [contactStatusMap, setContactStatusMap] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);


  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;

    // Fetch Orders
    const ordersRef = collection(firestore, 'orders');
    const qOrders = query(ordersRef, orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, 
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderData));
        setOrders(fetchedOrders);
        const initialStatus: Record<string, string> = {};
        fetchedOrders.forEach(order => {
          initialStatus[order.id] = order.status;
        });
        setOrderStatusMap(initialStatus);
        setIsOrdersLoading(false);
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setOrdersError('حدث خطأ أثناء جلب الطلبات.');
        setIsOrdersLoading(false);
      }
    );

    // Fetch Contact Requests
    const contactsRef = collection(firestore, 'contact_form_entries');
    const qContacts = query(contactsRef, orderBy('createdAt', 'desc'));
    const unsubscribeContacts = onSnapshot(qContacts, 
      (snapshot) => {
        const fetchedContacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactRequestData));
        setContactRequests(fetchedContacts);
        const initialStatus: Record<string, string> = {};
        fetchedContacts.forEach(req => {
            initialStatus[req.id] = req.status;
        });
        setContactStatusMap(initialStatus);
        setIsContactsLoading(false);
      },
      (err) => {
        console.error("Error fetching contact requests:", err);
        setContactsError('حدث خطأ أثناء جلب طلبات التواصل.');
        setIsContactsLoading(false);
      }
    );

    return () => {
        unsubscribeOrders();
        unsubscribeContacts();
    };
  }, [firestore]);

  const handleUpdateOrderStatus = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const newStatus = orderStatusMap[orderId];
    if (!newStatus || !firestore) return;

    setUpdatingId(orderId);
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast({
        title: 'تم تحديث الحالة',
        description: `تم تحديث حالة الطلب #${orderId} إلى "${newStatus}".`,
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
  
  const handleUpdateContactStatus = async (requestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = contactStatusMap[requestId];
    if (!newStatus || !firestore) return;

    setUpdatingId(requestId);
    try {
      const contactRef = doc(firestore, 'contact_form_entries', requestId);
      await updateDoc(contactRef, { status: newStatus });
      toast({
        title: 'تم تحديث الحالة',
        description: `تم تحديث حالة طلب التواصل #${requestId} إلى "${newStatus}".`,
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'خطأ في التحديث',
        description: 'لم نتمكن من تحديث حالة طلب التواصل. الرجاء المحاولة مرة أخرى.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'تم التوصيل':
      case 'تم استلام الطلب':
      case 'تم التواصل':
      case 'مغلق':
        return 'default'; // Green
      case 'تم الشحن':
        return 'secondary'; // Gray
      case 'قيد المعالجة':
      case 'جديد':
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

  const handleOrderStatusChange = (orderId: string, newStatus: string) => {
    setOrderStatusMap(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleContactStatusChange = (requestId: string, newStatus: string) => {
    setContactStatusMap(prev => ({ ...prev, [requestId]: newStatus }));
  };

  const renderLoading = (message: string) => (
    <div className="text-center text-muted-foreground py-10">
      <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
      <p className="mt-4">{message}</p>
    </div>
  );

  const renderError = (message: string) => (
     <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>خطأ</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  const renderEmpty = (title: string, description: string, Icon: React.ElementType) => (
    <div className="text-center text-muted-foreground py-20 max-w-lg mx-auto border-2 border-dashed rounded-lg">
        <Icon className="h-16 w-16 mx-auto" />
        <h3 className="mt-6 text-2xl font-headline">{title}</h3>
        <p className="mt-2 max-w-xs mx-auto">{description}</p>
    </div>
  );


  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          لوحة تحكم الإدارة
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          عرض وإدارة جميع الطلبات وطلبات التواصل من هنا.
        </p>
      </div>
      
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">
                <ShoppingBag className="ms-2 h-4 w-4" />
                جميع الطلبات ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="contacts">
                 <MessagesSquare className="ms-2 h-4 w-4" />
                طلبات التواصل ({contactRequests.length})
            </TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6">
            <Dialog>
                <Card>
                    <CardHeader>
                        <CardTitle>سجل الطلبات</CardTitle>
                        <CardDescription>انقر على أي طلب لعرض تفاصيله الكاملة.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isOrdersLoading && renderLoading('جاري تحميل الطلبات...')}
                        {ordersError && !isOrdersLoading && renderError(ordersError)}
                        {!isOrdersLoading && !ordersError && orders.length === 0 && renderEmpty('لا توجد طلبات بعد', 'عندما يقوم العميل بإجراء طلب جديد، سيظهر هنا.', ShoppingBag)}
                        {!isOrdersLoading && !ordersError && orders.length > 0 && (
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
                                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                                    <TableCell>{order.customer.name}</TableCell>
                                                    <TableCell>{new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                                    </TableCell>
                                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-2">
                                                            <Select value={orderStatusMap[order.id]} onValueChange={(newStatus) => handleOrderStatusChange(order.id, newStatus)}>
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
                                                                onClick={(e) => handleUpdateOrderStatus(order.id, e)}
                                                                disabled={updatingId === order.id || order.status === orderStatusMap[order.id]}
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
                        )}
                    </CardContent>
                </Card>
            </Dialog>
        </TabsContent>
        <TabsContent value="contacts" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>سجل طلبات التواصل</CardTitle>
                    <CardDescription>جميع الرسائل والاستفسارات الواردة من صفحة "تواصل معنا".</CardDescription>
                </CardHeader>
                <CardContent>
                     {isContactsLoading && renderLoading('جاري تحميل طلبات التواصل...')}
                     {contactsError && !isContactsLoading && renderError(contactsError)}
                     {!isContactsLoading && !contactsError && contactRequests.length === 0 && renderEmpty('لا توجد طلبات تواصل', 'عندما يقوم زائر بإرسال طلب تواصل، سيظهر هنا.', Users)}
                     {!isContactsLoading && !contactsError && contactRequests.length > 0 && (
                         <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">الرقم المرجعي</TableHead>
                                        <TableHead className="text-right">الاسم</TableHead>
                                        <TableHead className="text-right">تاريخ الطلب</TableHead>
                                        <TableHead className="text-right">الحالة</TableHead>
                                        <TableHead className="text-right w-[350px]">تغيير الحالة</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contactRequests.map(request => (
                                        <TableRow key={request.id}>
                                            <TableCell className="font-medium">{request.id}</TableCell>
                                            <TableCell>{request.customer.name}</TableCell>
                                            <TableCell>{new Date(request.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Select value={contactStatusMap[request.id] || ''} onValueChange={(newStatus) => handleContactStatusChange(request.id, newStatus)}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="اختر حالة" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CONTACT_STATUSES.map(status => (
                                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        onClick={(e) => handleUpdateContactStatus(request.id, e)}
                                                        disabled={updatingId === request.id || request.status === contactStatusMap[request.id]}
                                                        size="sm"
                                                    >
                                                        {updatingId === request.id ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : 'تحديث'}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                     )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>


      {selectedOrder && (
            <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline flex items-center gap-4">
                    تفاصيل الطلب 
                    <span className="font-mono text-base bg-muted px-2 py-1 rounded">#{selectedOrder.id}</span>
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
    </div>
  );
}
