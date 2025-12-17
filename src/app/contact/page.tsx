"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SAUDI_CITIES } from "@/lib/data";

const formSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل."),
  phone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل."),
  city: z.string({required_error: "الرجاء اختيار مدينة."}),
  address: z.string().min(10, "العنوان يجب أن يكون 10 أحرف على الأقل."),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const message = `طلب جديد:\n\nالاسم: ${values.name}\nرقم الهاتف: ${values.phone}\nالمدينة: ${values.city}\n\nالعنوان:\n${values.address}`;
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المدينة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مدينتك" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SAUDI_CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
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
                    <FormLabel>تفاصيل العنوان</FormLabel>
                    <FormControl>
                      <Input placeholder="اكتب اسم الشارع والحي هنا..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" size="lg">
                <Send className="ms-2 h-4 w-4" />
                إرسال الطلب عبر واتساب
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
