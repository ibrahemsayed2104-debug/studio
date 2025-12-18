"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, MapPin, Navigation } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SAUDI_CITIES, EGYPT_GOVERNORATES, COUNTRIES } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل."),
  phone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل."),
  country: z.string({ required_error: "الرجاء اختيار دولة." }),
  governorate: z.string().optional(),
  city: z.string({ required_error: "الرجاء اختيار مدينة." }).min(1, "الرجاء اختيار مدينة."),
  address: z.string().min(10, "العنوان يجب أن يكون 10 أحرف على الأقل."),
  buildingNumber: z.string().min(1, "الرجاء إدخال رقم العمارة."),
  floorNumber: z.string().min(1, "الرجاء إدخال رقم الدور."),
  apartmentNumber: z.string().min(1, "الرجاء إدخال رقم الشقة."),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      country: COUNTRIES[0],
      governorate: EGYPT_GOVERNORATES[0].governorate,
      city: "",
      address: "",
      buildingNumber: "",
      floorNumber: "",
      apartmentNumber: "",
    },
  });

  const selectedCountry = form.watch("country");
  const selectedGovernorate = form.watch("governorate");

  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    let newCities: string[] = [];
    if (selectedCountry === 'مصر') {
      const governorateData = EGYPT_GOVERNORATES.find(g => g.governorate === selectedGovernorate);
      newCities = governorateData ? governorateData.cities : [];
    } else if (selectedCountry === 'المملكة العربية السعودية') {
      newCities = SAUDI_CITIES;
    }
    setCities(newCities);
    form.resetField('city');
  }, [selectedCountry, selectedGovernorate, form]);
  
  useEffect(() => {
    if (selectedCountry !== 'مصر') {
      form.unregister('governorate');
    } else {
        form.register('governorate');
        if (!form.getValues('governorate')) {
             form.setValue('governorate', EGYPT_GOVERNORATES[0].governorate);
        }
    }
  }, [selectedCountry, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    let fullAddress = `${values.address}, عمارة ${values.buildingNumber}, الدور ${values.floorNumber}, شقة ${values.apartmentNumber}\n`;
    fullAddress += `${values.city}`;
    if (values.country === 'مصر' && values.governorate) {
        fullAddress += `, ${values.governorate}`;
    }
    fullAddress += `, ${values.country}`;

    const message = `\u200fطلب جديد:\n\nالاسم: ${values.name}\nرقم الهاتف: ${values.phone}\nالعنوان: ${fullAddress}`;
    const whatsappUrl = `https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');

    toast({
      title: "جاهز للإرسال عبر واتساب!",
      description: "سيتم فتح واتساب لإرسال رسالتك.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          تواصل معنا
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          هل لديك سؤال أو استفسار؟ نحن هنا للمساعدة.
        </p>
      </div>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>أرسل لنا رسالة</CardTitle>
            <CardDescription>املأ النموذج أدناه وسنعاود الاتصال بك.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input placeholder="اسمك الكامل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="05xxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدولة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر دولتك" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedCountry === 'مصر' && (
                  <FormField
                    control={form.control}
                    name="governorate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المحافظة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر محافظتك" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EGYPT_GOVERNORATES.map(g => <SelectItem key={g.governorate} value={g.governorate}>{g.governorate}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={cities.length === 0}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تفاصيل العنوان (الشارع والحي)</FormLabel>
                      <FormControl>
                        <Input placeholder="اكتب اسم الشارع والحي هنا..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="buildingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم العمارة</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="floorNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الدور</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="apartmentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الشقة</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full font-bold" size="lg">
                  <Send className="ms-2 h-4 w-4" />
                  إرسال الطلب عبر واتساب
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>موقعنا</CardTitle>
            <CardDescription>تفضل بزيارتنا في موقعنا.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-start space-x-4 space-x-reverse rounded-lg border p-4 bg-muted/50">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1">
                      <p className="font-semibold text-foreground">{siteConfig.contact.address}</p>
                      <p className="text-sm text-muted-foreground">جمهورية مصر العربية</p>
                  </div>
              </div>
              <Button asChild className="w-full font-bold" size="lg">
                  <Link href={siteConfig.contact.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation className="ms-2 h-4 w-4" />
                      افتح الموقع على خرائط جوجل
                  </Link>
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    