'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function CheckoutPage() {
  const { cartItems, itemCount, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    toast({
      title: "تم تقديم الطلب بنجاح!",
      description: "شكراً لك على التسوق معنا.",
    });
    clearCart();
    router.push('/order-success');
  };

  if (itemCount === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-12 md:py-20 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground/30" />
        <h1 className="mt-6 text-3xl font-headline font-bold">سلة التسوق الخاصة بك فارغة</h1>
        <p className="mt-4 text-muted-foreground">ليس لديك أي منتجات في سلة التسوق. دعنا نغير ذلك!</p>
        <Button asChild className="mt-8">
          <Link href="/">العودة إلى التسوق</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          إتمام الطلب
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          أنت على بعد خطوات قليلة من إكمال طلبك.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">معلومات الشحن والدفع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">معلومات الاتصال</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input id="name" required placeholder="مثال: محمد الأحمد" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" required placeholder="email@example.com" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">عنوان الشحن</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input id="address" required placeholder="123 شارع الملك فهد" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">المدينة</Label>
                    <Input id="city" required placeholder="الرياض" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">الرمز البريدي</Label>
                    <Input id="postal-code" required placeholder="12345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">الدولة</Label>
                    <Input id="country" required defaultValue="المملكة العربية السعودية" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">معلومات الدفع</h3>
                <div className="space-y-2">
                  <Label htmlFor="card-number">رقم البطاقة</Label>
                  <div className="relative">
                    <Input id="card-number" required placeholder="**** **** **** 1234" />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">تاريخ الانتهاء</Label>
                    <Input id="expiry-date" required placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" required placeholder="123" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="font-headline">ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>إجمالي المنتجات</p>
                <p>{itemCount}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full font-bold">تأكيد الطلب</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
