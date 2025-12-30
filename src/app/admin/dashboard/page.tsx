
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ShoppingBag, Truck, CheckCircle, PackageOpen, MessagesSquare, Users, PlusCircle, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PRODUCTS, fabrics, SIZES, COLORS, STYLES, COUNTRIES, SAUDI_CITIES, EGYPT_GOVERNORATES } from '@/lib/data';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  } | null;
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
  } | null;
  status: string;
}

const ORDER_STATUSES = ['قيد المعالجة', 'تم الشحن', 'تم التوصيل', 'تم استلام الطلب', 'ملغي'];
const CONTACT_STATUSES = ['جديد', 'تم التواصل', 'مغلق'];

const orderItemSchema = z.object({
    productId: z.string().min(1, "الرجاء اختيار منتج."),
    quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل."),
    fabric: z.string().min(1, "الرجاء اختيار القماش."),
    size: z.string().min(1, "الرجاء اختيار المقاس."),
    color: z.string().min(1, "الرجاء اختيار اللون."),
    style: z.string().min(1, "الرجاء اختيار الستايل."),
});

const newOrderSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب."),
  customerPhone: z.string().refine(val => /^(01|05)\d{8,9}$/.test(val), { message: "رقم هاتف غير صالح." }),
  customerAddress: z.string().min(10, "العنوان مطلوب."),
  status: z.string().min(1, "الحالة مطلوبة."),
  items: z.array(orderItemSchema).min(1, "يجب إضافة منتج واحد على الأقل."),
});

type NewOrderFormValues = z.infer<typeof newOrderSchema>;


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
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<NewOrderFormValues>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      status: 'قيد المعالجة',
      items: [{ productId: '', quantity: 1, fabric: '', size: '', color: '', style: '' }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  useEffect(() => {
    if (!firestore) return;

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
        description: `تم تحديث حالة الطلب إلى "${newStatus}".`,
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
        description: `تم تحديث حالة طلب التواصل إلى "${newStatus}".`,
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

  const handleCreateOrder = async (values: NewOrderFormValues) => {
    if (!firestore) return;

    const orderData = {
        customer: {
            name: values.customerName,
            phone: values.customerPhone,
            address: values.customerAddress,
        },
        items: values.items.map(item => ({
            productId: item.productId,
            productName: PRODUCTS.find(p => p.id === item.productId)?.name || 'منتج غير معروف',
            quantity: Number(item.quantity),
            customization: {
                fabric: item.fabric,
                size: item.size,
                color: item.color,
                style: item.style,
            },
        })),
        itemCount: values.items.reduce((acc, item) => acc + Number(item.quantity), 0),
        status: values.status,
        createdAt: serverTimestamp(),
    };

    try {
        await addDoc(collection(firestore, 'orders'), orderData);
        toast({
            title: 'تم إنشاء الطلب',
            description: 'تم إنشاء الطلب اليدوي بنجاح.',
        });
        setIsAddOrderOpen(false);
        form.reset();
        setCurrentStep(1);
    } catch (err) {
        console.error("Error creating manual order:", err);
        toast({
            variant: 'destructive',
            title: 'خطأ في إنشاء الطلب',
            description: 'لم نتمكن من إنشاء الطلب. الرجاء المحاولة مرة أخرى.',
        });
    }
  };

  const handleNextStep = async () => {
    const isItemsValid = await form.trigger("items");
    const isStatusValid = await form.trigger("status");
    if (isItemsValid && isStatusValid) {
        setCurrentStep(2);
    } else {
        toast({
            variant: "destructive",
            title: "خطأ في الإدخال",
            description: "الرجاء التأكد من تعبئة جميع تفاصيل المنتجات بشكل صحيح.",
        });
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'تم التوصيل':
      case 'تم استلام الطلب':
      case 'تم التواصل':
      case 'مغلق':
        return 'default';
      case 'تم الشحن':
        return 'secondary';
      case 'قيد المعالجة':
      case 'جديد':
        return 'outline';
       case 'ملغي':
        return 'destructive';
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>سجل الطلبات</CardTitle>
                        <CardDescription>انقر على أي طلب لعرض تفاصيله الكاملة.</CardDescription>
                    </div>
                    <Dialog open={isAddOrderOpen} onOpenChange={(isOpen) => { setIsAddOrderOpen(isOpen); if (!isOpen) { form.reset(); setCurrentStep(1); } }}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="ms-2 h-4 w-4" />
                                إضافة طلب جديد
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl" onInteractOutside={(e) => e.preventDefault()}>
                            <DialogHeader>
                                <DialogTitle>إضافة طلب جديد يدويًا</DialogTitle>
                                <DialogDescription>
                                    الخطوة {currentStep} من 2: {currentStep === 1 ? 'تفاصيل المنتجات' : 'بيانات العميل'}
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleCreateOrder)} className="space-y-6">
                                    <ScrollArea className="h-[60vh] p-4 border-b">
                                        {currentStep === 1 && (
                                            <div className="space-y-6 animate-in fade-in-50">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>المنتجات المطلوبة</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {fields.map((field, index) => (
                                                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/30">
                                                            <h4 className="font-semibold">المنتج #{index + 1}</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <FormField control={form.control} name={`items.${index}.productId`} render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>المنتج</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <FormControl><SelectTrigger><SelectValue placeholder="اختر منتجًا" /></SelectTrigger></FormControl>
                                                                            <SelectContent><ScrollArea className="h-48">{PRODUCTS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</ScrollArea></SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )} />
                                                            <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>الكمية</FormLabel>
                                                                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)} /></FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )} />
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <FormField control={form.control} name={`items.${index}.fabric`} render={({ field }) => (
                                                                    <FormItem><FormLabel>القماش</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر قماش"/></SelectTrigger></FormControl><SelectContent><ScrollArea className="h-48">{fabrics.map(f => <SelectItem value={f} key={f}>{f}</SelectItem>)}</ScrollArea></SelectContent></Select><FormMessage /></FormItem>
                                                                )}/>
                                                                <FormField control={form.control} name={`items.${index}.size`} render={({ field }) => (
                                                                    <FormItem><FormLabel>المقاس</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر مقاس"/></SelectTrigger></FormControl><SelectContent>{SIZES.map(s => <SelectItem value={s} key={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                                                )}/>
                                                                <FormField control={form.control} name={`items.${index}.color`} render={({ field }) => (
                                                                    <FormItem><FormLabel>اللون</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر لون"/></SelectTrigger></FormControl><SelectContent><ScrollArea className="h-48">{COLORS.map(c => <SelectItem value={c} key={c}>{c}</SelectItem>)}</ScrollArea></SelectContent></Select><FormMessage /></FormItem>
                                                                )}/>
                                                                <FormField control={form.control} name={`items.${index}.style`} render={({ field }) => (
                                                                    <FormItem><FormLabel>الستايل</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر ستايل"/></SelectTrigger></FormControl><SelectContent>{STYLES.map(s => <SelectItem value={s} key={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                                                )}/>
                                                            </div>
                                                            {fields.length > 1 && (
                                                                <Button type="button" variant="destructive" size="icon" className="absolute top-2 left-2 h-7 w-7" onClick={() => remove(index)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => append({ productId: '', quantity: 1, fabric: '', size: '', color: '', style: '' })}
                                                        >
                                                            إضافة منتج آخر
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                                <FormField control={form.control} name="status" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>حالة الطلب</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="اختر حالة" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                {ORDER_STATUSES.map(status => (
                                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        )}

                                        {currentStep === 2 && (
                                            <div className="space-y-6 animate-in fade-in-50">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>معلومات العميل</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField control={form.control} name="customerName" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>اسم العميل</FormLabel>
                                                                    <FormControl><Input {...field} placeholder="الاسم الكامل للعميل" /></FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )} />
                                                            <FormField control={form.control} name="customerPhone" render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>رقم هاتف العميل</FormLabel>
                                                                    <FormControl><Input {...field} placeholder="01xxxxxxxxx أو 05xxxxxxxx" /></FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )} />
                                                        </div>
                                                        <FormField control={form.control} name="customerAddress" render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>عنوان العميل</FormLabel>
                                                                <FormControl><Input {...field} placeholder="العنوان الكامل بالتفصيل" /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )}
                                    </ScrollArea>
                                    <DialogFooter className="pt-4 flex justify-between w-full">
                                        <div>
                                            {currentStep === 2 && (
                                                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                                                    <ArrowRight className="ms-2 h-4 w-4" />
                                                    السابق
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="ghost" onClick={() => setIsAddOrderOpen(false)}>إلغاء</Button>
                                            {currentStep === 1 && (
                                                <Button type="button" onClick={handleNextStep}>
                                                    التالي
                                                    <ArrowLeft className="me-2 h-4 w-4" />
                                                </Button>
                                            )}
                                            {currentStep === 2 && (
                                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                                    {form.formState.isSubmitting && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
                                                    إنشاء الطلب
                                                </Button>
                                            )}
                                        </div>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {isOrdersLoading && renderLoading('جاري تحميل الطلبات...')}
                    {ordersError && !isOrdersLoading && renderError(ordersError)}
                    {!isOrdersLoading && !ordersError && orders.length === 0 && renderEmpty('لا توجد طلبات بعد', 'عندما يقوم العميل بإجراء طلب جديد، سيظهر هنا.', ShoppingBag)}
                    {!isOrdersLoading && !ordersError && orders.length > 0 && (
                        <Dialog>
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
                                                    <TableCell>{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'الآن'}</TableCell>
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
                             {selectedOrder && (
                                <DialogContent className="sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-headline flex items-center gap-4">
                                            تفاصيل الطلب 
                                            <span className="font-mono text-base bg-muted px-2 py-1 rounded">#{selectedOrder.id}</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            {selectedOrder.createdAt ? `تم إنشاء الطلب في: ${new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString('ar-EG')}` : 'جاري إنشاء الطلب...'}
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
                </CardContent>
            </Card>
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
                                            <TableCell>{request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'الآن'}</TableCell>
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
    </div>
  );
}

