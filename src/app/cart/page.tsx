'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { siteConfig } from '@/lib/config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SAUDI_CITIES, EGYPT_GOVERNORATES, COUNTRIES } from '@/lib/data';

export default function CheckoutPage() {
  const { cartItems, itemCount, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  
  useEffect(() => {
    if (selectedCountry === 'مصر') {
        const governorateData = EGYPT_GOVERNORATES.find(g => g.governorate === selectedGovernorate);
        setCities(governorateData ? governorateData.cities : []);
    } else if (selectedCountry === 'المملكة العربية السعودية') {
        setCities(SAUDI_CITIES);
    } else {
        setCities([]);
    }
    setSelectedCity('');
  }, [selectedCountry, selectedGovernorate]);
  
  useEffect(() => {
    if (selectedCountry === 'مصر') {
        setSelectedGovernorate(EGYPT_GOVERNORATES[0].governorate);
    } else {
        setSelectedGovernorate('');
    }
  }, [selectedCountry]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedCity) {
        toast({
            variant: "destructive",
            title: "خطأ في الإدخال",
            description: "الرجاء اختيار مدينة.",
        });
        return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const orderId = `order_${Date.now()}`;

    // Construct WhatsApp message
    let message = `*طلب جديد من ${siteConfig.name}*\n`;
    message += `*رقم الطلب:* ${orderId}\n\n`;
    message += `*معلومات العميل:*\n`;
    message += `الاسم: ${data.name}\n`;
    message += `رقم الهاتف: ${data.phone}\n`;
    
    let fullAddress = `${data.address}, عمارة ${data['building-number']}, الدور ${data['floor-number']}, شقة ${data['apartment-number']}\n`;
    fullAddress += `${selectedCity}`;
    if (selectedCountry === 'مصر' && data.governorate) {
        fullAddress += `, ${data.governorate}`;
    }
    fullAddress += `, ${data.country}`;

    if (data['postal-code']) {
      fullAddress += `, الرمز البريدي: ${data['postal-code']}`;
    }

    message += `العنوان: ${fullAddress}\n\n`;
    
    message += `*المنتجات المطلوبة:*\n`;
    cartItems.forEach(item => {
      message += `--------------------\n`;
      message += `المنتج: ${item.product.name}\n`;
      message += `الكمية: ${item.quantity}\n`;
      message += `التخصيص: ${item.customization.fabric}, ${item.customization.size}, ${item.customization.color}, ${item.customization.style}\n`;
    });
    message += `--------------------\n`;
    message += `*إجمالي عدد المنتجات:* ${itemCount}\n\n`;
    message += `*طريقة الدفع:* الدفع عند الاستلام (كاش)`;

    const whatsappUrl = `https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');

    toast({
      title: "تم توجيهك إلى واتساب!",
      description: "أرسل الرسالة لتأكيد طلبك.",
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
                    <Input id="name" name="name" required placeholder="مثال: محمد الأحمد" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="01xxxxxxxxx" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">عنوان الشحن</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="country">الدولة</Label>
                        <Select name="country" required value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger id="country">
                                <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map(country => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedCountry === 'مصر' && (
                        <div className="space-y-2">
                            <Label htmlFor="governorate">المحافظة</Label>
                            <Select name="governorate" required value={selectedGovernorate} onValueChange={setSelectedGovernorate}>
                                <SelectTrigger id="governorate">
                                    <SelectValue placeholder="اختر المحافظة" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EGYPT_GOVERNORATES.map(gov => (
                                    <SelectItem key={gov.governorate} value={gov.governorate}>{gov.governorate}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان (الشارع والحي)</Label>
                  <Input id="address" name="address" required placeholder="مثال: شارع التسعين، حي الياسمين" />
                </div>
                 <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="building-number">رقم العمارة</Label>
                        <Input id="building-number" name="building-number" required placeholder="مثال: 15" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="floor-number">الدور</Label>
                        <Input id="floor-number" name="floor-number" required placeholder="مثال: 3" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apartment-number">رقم الشقة</Label>
                        <Input id="apartment-number" name="apartment-number" required placeholder="مثال: 12" />
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">المدينة</Label>
                    <Select name="city" required value={selectedCity} onValueChange={setSelectedCity} disabled={cities.length === 0}>
                        <SelectTrigger id="city">
                            <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">الرمز البريدي (اختياري)</Label>
                    <Input id="postal-code" name="postal-code" placeholder="12345" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">طريقة الدفع</h3>
                <div className="border rounded-md p-4 flex items-center gap-4 bg-muted/30">
                    <Wallet className="h-8 w-8 text-primary"/>
                    <div>
                        <p className="font-semibold">الدفع عند الاستلام</p>
                        <p className="text-sm text-muted-foreground">ادفع نقدًا عند وصول طلبك.</p>
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
              <Button type="submit" size="lg" className="w-full font-bold">
                تأكيد الطلب وإرسال عبر واتساب
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

    