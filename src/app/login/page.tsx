'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, KeyRound } from 'lucide-react';
import { siteConfig } from '@/lib/config';

// Add a div with id="recaptcha-container" to the page
// This is where the reCAPTCHA widget will be rendered
// Make sure it is visible or it will fail silently
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        confirmationResult: ConfirmationResult;
    }
}

export default function LoginPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || isOtpSent) return;

    // Set up reCAPTCHA verifier
    // This is invisible and is used to prevent spam and abuse
    try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // console.log("reCAPTCHA verified");
            }
          });
    } catch(e) {
        console.error("Error setting up RecaptchaVerifier", e);
        setError("فشل إعداد reCAPTCHA. الرجاء تحديث الصفحة.");
    }
    
    return () => {
        // Cleanup reCAPTCHA on component unmount
        if (window.recaptchaVerifier) {
            // No direct 'destroy' or 'clear' method available in the compat library's type definitions
            // but the verifier instance should be self-contained.
        }
    }
  }, [auth]);

  const handleSendOtp = async () => {
    if (!auth) {
        setError("خدمة المصادقة غير متاحة.");
        return;
    }
    if (phoneNumber.length < 10) {
      setError('الرجاء إدخال رقم هاتف صالح.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const verifier = window.recaptchaVerifier;
      const fullPhoneNumber = `+${phoneNumber}`;
      
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
      if(err.code === 'auth/invalid-phone-number') {
        errorMessage = 'رقم الهاتف الذي أدخلته غير صالح.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'تم إرسال عدد كبير جدًا من الطلبات. الرجاء المحاولة لاحقًا.';
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'فشل إرسال الرمز', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('الرجاء إدخال رمز التحقق المكون من 6 أرقام.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await window.confirmationResult.confirm(otp);
      // User signed in successfully.
      const user = result.user;
      console.log("User signed in successfully", user);
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحبًا بك في متجرنا!',
      });
      router.push('/');
    } catch (err: any) {
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
          <div id="recaptcha-container"></div>
          {!isOtpSent ? (
            <div className="space-y-4">
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
              <Button onClick={handleSendOtp} className="w-full font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Phone className="ms-2 h-4 w-4" />}
                إرسال رمز التحقق
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
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <KeyRound className="ms-2 h-4 w-4" />}
                التحقق وتسجيل الدخول
              </Button>
              <Button variant="link" onClick={() => setIsOtpSent(false)} className="w-full">
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
