"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل."),
  phone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل."),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل."),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const phoneWhatsApp = "9661111148566"; // Your WhatsApp number with country code, without + or 00
    const message = `مرحبًا،\n\nلدي استفسار من:\nالاسم: ${values.name}\nرقم الهاتف: ${values.phone}\n\nالرسالة:\n${values.message}`;
    const whatsappUrl = `https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(message)}`;
    
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
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رسالتك</FormLabel>
                    <FormControl>
                      <Textarea placeholder="اكتب رسالتك هنا..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" size="lg">
                <Send className="ms-2 h-4 w-4" />
                إرسال الرسالة عبر واتساب
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
