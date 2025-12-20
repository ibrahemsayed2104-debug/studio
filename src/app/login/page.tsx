'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, KeyRound } from 'lucide-react';

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupRecaptcha = () => {
    if (!auth) {
        setError("خدمة المصادقة غير متاحة.");
        return null;
    }
    
    // Cleanup previous verifier if it exists to avoid conflicts
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    try {
      const verifier = new RecaptchaVerifier(auth, 'send-otp-button', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
           setError('انتهت صلاحية reCAPTCHA. الرجاء المحاولة مرة أخرى.');
           setIsLoading(false);
        }
      });
      return verifier;
    } catch (e) {
      setError("فشل إعداد reCAPTCHA. الرجاء تحديث الصفحة والمحاولة مرة أخرى.");
      setIsLoading(false);
      return null;
    }
  }

  const handleSendOtp = async () => {
    setError(null);
    if (!phoneNumber || !/^\d{10,11}$/.test(phoneNumber)) {
      setError('الرجاء إدخال رقم هاتف مصري صالح (10 أو 11 رقمًا).');
      return;
    }
    if (!auth) {
        setError("خدمة المصادقة غير متاحة.");
        return;
    }
    
    setIsLoading(true);
    
    const verifier = setupRecaptcha();
    if (!verifier) {
      setIsLoading(false);
      return;
    }

    const fullPhoneNumber = `+20${phoneNumber}`;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
      window.confirmationResult = confirmationResult;

      setIsOtpSent(true);
      toast({
        title: 'تم إرسال الرمز',
        description: `تم إرسال رمز التحقق إلى رقمك ${fullPhoneNumber}`,
      });

    } catch (err: any) {
      console.error("Error sending OTP:", err);
      let errorMessage = 'حدث خطأ أثناء إرسال الرمز. الرجاء المحاولة مرة أخرى.';
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'رقم الهاتف الذي أدخلته غير صالح.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'تم إرسال عدد كبير جدًا من الطلبات. الرجاء المحاولة لاحقًا.';
      } else if (err.message.includes('reCAPTCHA')) {
        errorMessage = 'فشل التحقق من reCAPTCHA. الرجاء تحديث الصفحة والمحاولة مرة أخرى.';
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'فشل إرسال الرمز', description: errorMessage });
    } finally {
      setIsLoading(false);
      // Clean up verifier after use
      verifier.clear();
    }
  };

  const handleVerifyOtp = async () => {
    if (!window.confirmationResult) {
      setError("لم يتم طلب رمز التحقق. الرجاء طلب الرمز أولاً.");
      return;
    }
    if (otp.length !== 6) {
      setError('الرجاء إدخال رمز التحقق المكون من 6 أرقام.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await window.confirmationResult.confirm(otp);
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحبًا بك في متجرنا!',
      });
      router.push('/');
      router.refresh();
    } catch (err: any)      {
      console.error("Error verifying OTP:", err);
      let errorMessage = 'رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى.';
      if (err.code === 'auth/invalid-verification-code') {
          errorMessage = 'رمز التحقق الذي أدخلته غير صالح.';
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'فشل التحقق', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-muted/20 py-12">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">تسجيل الدخول أو إنشاء حساب</CardTitle>
          <CardDescription>استخدم رقم هاتفك للوصول إلى حسابك.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف (داخل مصر)</Label>
                 <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 rounded-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        +20
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      placeholder="1112223344"
                      dir="ltr"
                      className="rounded-l-md"
                    />
                </div>
              </div>
              
              <Button id="send-otp-button" onClick={handleSendOtp} className="w-full font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Phone className="ms-2 h-4 w-4" />}
                {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">رمز التحقق</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="xxxxxx"
                  maxLength={6}
                  dir="ltr"
                   onKeyUp={(e) => e.key === 'Enter' && handleVerifyOtp()}
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <KeyRound className="ms-2 h-4 w-4" />}
                التحقق وتسجيل الدخول
              </Button>
              <Button variant="link" onClick={() => { setIsOtpSent(false); setError(null); if (window.recaptchaVerifier) { window.recaptchaVerifier.clear();} }} className="w-full">
                تغيير رقم الهاتف
              </Button>
            </div>
          )}
          {error && <p className="text-sm text-destructive mt-4 text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
