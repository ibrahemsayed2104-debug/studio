
'use client';

import { useState } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PackageSearch, AlertCircle } from 'lucide-react';
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

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!orderId.trim() || !firestore) {
      setError('الرجاء إدخال رقم طلب صالح.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearchedOrder(null);

    try {
      const orderRef = doc(firestore, 'orders', orderId.trim());
      const docSnap = await getDoc(orderRef);

      if (docSnap.exists()) {
        const orderData = { id: docSnap.id, ...docSnap.data() } as OrderData;
        setSearchedOrder(orderData);
      } else {
        setError('لم يتم العثور على طلب بهذا الرقم. يرجى التحقق من الرقم والمحاولة مرة أخرى.');
      }
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء البحث عن طلبك. يرجى المحاولة مرة أخرى لاحقًا.');
      toast({
        variant: 'destructive',
        title: 'خطأ في البحث',
        description: 'حدث خطأ أثناء البحث عن الطلب. قد يكون السبب قيود الأمان.',
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          تتبع طلبك
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          أدخل رقم الطلب الخاص بك أدناه لعرض حالته وتفاصيله.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>البحث عن الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="أدخل رقم طلبك هنا..."
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
          <p className="mt-4">...جاري البحث عن طلبك</p>
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && searchedOrder && (
        <Card>
            <CardHeader>
              <CardTitle>تفاصيل الطلب #{searchedOrder.id}</CardTitle>
              <div className="flex justify-between items-center pt-2">
                <CardDescription>
                  تاريخ الطلب: {new Date(searchedOrder.createdAt.seconds * 1000).toLocaleDateString('ar-EG')}
                </CardDescription>
                <Badge variant={getStatusVariant(searchedOrder.status)} className="text-sm">{searchedOrder.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">ملخص الطلب ({searchedOrder.itemCount})</h4>
                  {searchedOrder.items.map((item, index) => (
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
                    <p><span className="font-medium text-foreground">الاسم:</span> {searchedOrder.customer.name}</p>
                    <p><span className="font-medium text-foreground">العنوان:</span> {searchedOrder.customer.address}</p>
                    <p><span className="font-medium text-foreground">رقم الهاتف:</span> {searchedOrder.customer.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
      )}
    </div>
  );
}

    