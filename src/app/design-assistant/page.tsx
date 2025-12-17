'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Wand2, Loader2, Lightbulb, Palette, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getDesignAdvice, type DesignAdviceOutput } from '@/ai/flows/design-assistant';
import { PRODUCTS } from '@/lib/data';

export default function DesignAssistantPage() {
  const [roomDescription, setRoomDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<DesignAdviceOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateAdvice = async () => {
    if (roomDescription.trim().length < 20) {
      setError('الرجاء تقديم وصف أكثر تفصيلاً للغرفة (20 حرفًا على الأقل).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const result = await getDesignAdvice({ roomDescription });
      setAdvice(result);
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.';
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'خطأ في إنشاء النصيحة', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getProductImage = (productId: string) => {
    return PRODUCTS.find(p => p.id === productId)?.image || '';
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          مساعد التصميم الذكي
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          هل أنت في حيرة من أمرك؟ صف لنا غرفتك ودع الذكاء الاصطناعي يساعدك في اختيار الستارة المثالية.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">صف لنا غرفتك</CardTitle>
              <CardDescription>كلما زادت التفاصيل، كانت النصيحة أفضل.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="مثال: غرفة جلوس مودرن بألوان محايدة (أبيض، رمادي)، أريكة رمادية كبيرة، أرضيات خشبية فاتحة، وأحتاج لشيء يضيف لمسة من الدفء والأناقة."
                className="min-h-[150px] text-base"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
              />
              <Button onClick={handleGenerateAdvice} disabled={isLoading} className="w-full mt-4 font-bold">
                {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Wand2 className="ms-2 h-4 w-4" />}
                {isLoading ? 'جاري التحليل...' : 'احصل على نصيحة'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="md:col-span-2">
          <Card className="min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">توصية المصمم</CardTitle>
              <CardDescription>هذه هي توصياتنا المصممة خصيصًا لك.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              {isLoading && (
                <div className="text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4">يقوم خبيرنا بتحليل مساحتك...</p>
                </div>
              )}
              {error && !isLoading && (
                <Alert variant="destructive" className="w-full">
                  <AlertTitle>حدث خطأ</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!isLoading && !error && !advice && (
                <div className="text-center text-muted-foreground p-8">
                  <Wand2 className="h-16 w-16 mx-auto" />
                  <p className="mt-4 max-w-xs">ستظهر توصيات التصميم الخاصة بك هنا. ابدأ بوصف غرفتك!</p>
                </div>
              )}
              {advice && (
                <div className="space-y-6 w-full animate-in fade-in-50 duration-500">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-bold font-headline text-lg flex items-center gap-2"><Sparkles className="text-primary" /> تحليل الغرفة</h3>
                    <p className="mt-2 text-muted-foreground">{advice.analysis}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-bold font-headline text-lg flex items-center gap-2"><Palette className="text-primary" /> توصيات الألوان والأقمشة</h3>
                    <p className="mt-2 text-muted-foreground">{advice.fabricRecommendation}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {advice.colorPalette.map(color => (
                        <span key={color} className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground">{color}</span>
                      ))}
                    </div>
                  </div>
                   <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-800">
                    <h3 className="font-bold font-headline text-lg flex items-center gap-2 text-amber-800 dark:text-amber-300"><Lightbulb /> نصيحة الخبراء</h3>
                    <p className="mt-2 text-amber-700 dark:text-amber-400">{advice.styleTip}</p>
                  </div>

                  <div>
                    <h3 className="font-bold font-headline text-lg flex items-center gap-2 mb-4"><ShoppingBag className="text-primary" /> منتجات مقترحة لك</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {advice.recommendedProducts.map(product => (
                            <Card key={product.id} className="overflow-hidden">
                                <div className="relative h-40 w-full">
                                    <Image src={getProductImage(product.id)} alt={product.name} fill className="object-cover" />
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
                                    <CardDescription className="text-xs pt-1">{product.reason}</CardDescription>
                                </CardHeader>
                                <CardFooter className="p-4 pt-0">
                                    <Button asChild className="w-full" size="sm">
                                        <Link href={`/products/${product.id}`}>عرض المنتج</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
