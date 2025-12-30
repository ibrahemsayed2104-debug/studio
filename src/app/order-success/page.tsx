
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast({
        title: 'تم النسخ!',
        description: 'تم نسخ رقم الطلب إلى الحافظة.',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">شكرًا لك على طلبك!</CardTitle>
          <CardDescription className="text-lg">
            لقد تم استلام طلبك بنجاح وجارٍ معالجته.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orderId && (
            <div className="mb-6">
              <p className="text-muted-foreground">احتفظ برقم طلبك لتتبع حالته:</p>
              <div className="mt-2 flex justify-center items-center gap-2">
                <p className="text-lg font-mono font-bold p-2 border-2 border-dashed rounded-md bg-muted">
                  {orderId}
                </p>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
          <p className="text-muted-foreground">
            يمكنك تتبع حالة طلبك من صفحة <Link href="/orders" className="text-primary hover:underline">تتبع طلبك</Link>.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold">
            <Link href="/">مواصلة التسوق</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

    