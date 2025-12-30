
'use client';

import { useState } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PackageSearch, AlertCircle, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  status: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}


export default function TrackOrderPage() {
  const [searchId, setSearchId] = useState('');
  const [searchedItem, setSearchedItem] = useState<OrderData | ContactRequestData | null>(null);
  const [itemType, setItemType] = useState<'order' | 'contact' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchId.trim() || !firestore) {
      setError('الرجاء إدخال رقم طلب صالح.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearchedItem(null);
    setItemType(null);

    try {
      const trimmedId = searchId.trim();
      // 1. Try searching in 'orders' collection
      const orderRef = doc(firestore, 'orders', trimmedId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const orderData = { id: orderSnap.id, ...orderSnap.data() } as OrderData;
        setSearchedItem(orderData);
        setItemType('order');
      } else {
        // 2. If not found, try searching in 'contact_form_entries'
        const contactRef = doc(firestore, 'contact_form_entries', trimmedId);
        const contactSnap = await getDoc(contactRef);
        
        if (contactSnap.exists()) {
          const contactData = { id: contactSnap.id, ...contactSnap.data() } as ContactRequestData;
          setSearchedItem(contactData);
          setItemType('contact');
        } else {
          setError('لم يتم العثور على طلب أو طلب تواصل بهذا الرقم. يرجى التحقق من الرقم والمحاولة مرة أخرى.');
        }
      }
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى لاحقًا.');
      toast({
        variant: 'destructive',
        title: 'خطأ في البحث',
        description: 'حدث خطأ أثناء البحث. قد يكون السبب قيود الأمان.',
      });
    } finally {
      setIsLoading(false);
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
  
  const renderOrderDetails = (order: OrderData) => (
    <Card>
        <CardHeader>
          <CardTitle>تفاصيل الطلب #{order.id}</CardTitle>
          <div className="flex justify-between items-center pt-2">
            <CardDescription>
              تاريخ الطلب: {new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}
            </CardDescription>
            <Badge variant={getStatusVariant(order.status)} className="text-sm">{order.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
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
          </div>
        </CardContent>
    </Card>
  );

  const renderContactRequestDetails = (request: ContactRequestData) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                تفاصيل طلب التواصل #{request.id}
            </CardTitle>
            <div className="flex justify-between items-center pt-2">
                <CardDescription>
                    تاريخ الطلب: {new Date(request.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}
                </CardDescription>
                <Badge variant={getStatusVariant(request.status)} className="text-sm">{request.status}</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <h4 className="font-semibold">معلومات العميل</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p><span className="font-medium text-foreground">الاسم:</span> {request.customer.name}</p>
                    <p><span className="font-medium text-foreground">العنوان:</span> {request.customer.address}</p>
                    <p><span className="font-medium text-foreground">رقم الهاتف:</span> {request.customer.phone}</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );


  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          تتبع طلبك
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          أدخل رقم الطلب أو الرقم المرجعي للتواصل لعرض حالته وتفاصيله.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="أدخل رقمك المرجعي هنا..."
              className="flex-grow text-lg"
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading} size="lg" className="font-bold">
              {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <PackageSearch className="ms-2 h-4 w-4" />}
              تتبع
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center text-muted-foreground py-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4">...جاري البحث</p>
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && searchedItem && (
        <>
            {itemType === 'order' && renderOrderDetails(searchedItem as OrderData)}
            {itemType === 'contact' && renderContactRequestDetails(searchedItem as ContactRequestData)}
        </>
      )}
    </div>
  );
}

    