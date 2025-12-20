'use client';

import { useState, useEffect, useRef } from 'react';
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
        return;
    }

    // Cleanup previous verifier if it exists
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
    }

    try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal', // Use visible reCAPTCHA
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // This callback is where you should initiate the phone number sign-in.
                console.log("reCAPTCHA solved, sending OTP...");
                handleSendOtp();
            },
            'expired-callback': () => {
                setError('انتهت صلاحية التحقق، الرجاء المحاولة مرة أخرى.');
                setIsLoading(false);
            }
        });
        window.recaptchaVerifier.render(); // Explicitly render the verifier
    } catch (e) {
        console.error("Recaptcha setup error:", e);
        setError("فشل في إعداد reCAPTCHA. الرجاء تحديث الصفحة.");
    }
  }

  // Set up reCAPTCHA on component mount
  useEffect(() => {
    setupRecaptcha();
  }, [auth]);

  const handleSendOtp = async () => {
    if (!auth || !window.recaptchaVerifier) {
        setError("خدمة المصادقة أو reCAPTCHA غير جاهزة.");
        return;
    }
    if (phoneNumber.length < 10) {
      setError('الرجاء إدخال رقم هاتف صالح.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fullPhoneNumber = `+${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
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
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'فشل إرسال الرمز', description: errorMessage });
      // Reset reCAPTCHA on error
      setupRecaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!window.confirmationResult) {
      setError("لم يتم طلب رمز التحقق. الرجاء طلب الرمز أولاً.");
      return;
    }
    if (otp.length < 6) {
      setError('الرجاء إدخال رمز التحقق المكون من 6 أرقام.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      console.log("User signed in successfully", user);
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

  // This will be triggered by reCAPTCHA callback
  const onRecaptchaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // The actual OTP sending is handled by the reCAPTCHA callback
    if (!window.recaptchaVerifier || !window.recaptchaVerifier.getResponse()) {
        setError("الرجاء التحقق من أنك لست برنامج روبوت.");
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
            <form onSubmit={onRecaptchaSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف (مع رمز الدولة)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="مثال: 201112223344"
                  dir="ltr"
                />
              </div>
              
              {/* This container is used by the RecaptchaVerifier */}
              <div id="recaptcha-container" className="flex justify-center"></div>

              <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Phone className="ms-2 h-4 w-4" />}
                {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </Button>
            </form>
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
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <KeyRound className="ms-2 h-4 w-4" />}
                التحقق وتسجيل الدخول
              </Button>
              <Button variant="link" onClick={() => { setIsOtpSent(false); setupRecaptcha(); }} className="w-full">
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
