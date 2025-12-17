import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full text-center">
        <CardHeader>
            <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          <CardTitle className="text-3xl font-headline mt-4">شكراً لك على طلبك!</CardTitle>
          <CardDescription className="text-lg">
            لقد تم استلام طلبك بنجاح. ستتلقى رسالة تأكيد بالبريد الإكتروني قريبًا.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            يمكنك تتبع حالة طلبك من صفحة <Link href="/orders" className="text-primary hover:underline">طلباتي</Link>.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold">
            <Link href="/">مواصلة التسوق</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
