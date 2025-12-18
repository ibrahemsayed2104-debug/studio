'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';
import { login } from './actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(password);
      if (result.success) {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'جاري توجيهك إلى لوحة التحكم.',
        });
        router.push('/admin');
        router.refresh(); // Refresh to apply cookie and middleware
      } else {
        throw new Error(result.error || 'كلمة المرور غير صحيحة.');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'فشل تسجيل الدخول',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">لوحة تحكم المدير</CardTitle>
          <CardDescription>الرجاء إدخال كلمة المرور للوصول.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
            </div>
             {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="ms-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="ms-2 h-4 w-4" />
              )}
              دخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
