'use client';

import { useState, useRef } from 'react';
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

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  
  // This container is required by RecaptchaVerifier
  const recaptchaContainerId = "recaptcha-container";


  const handleSendOtp = async () => {
    setError(null);
    setIsLoading(true);

    if (!auth) {
      setError("خدمة المصادقة غير متاحة.");
      setIsLoading(false);
      return;
    }
    
    // Always destroy the old verifier if it exists
    if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
    }

    try {
      const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
           setError('انتهت صلاحية reCAPTCHA. الرجاء المحاولة مرة أخرى.');
        }
      });
      recaptchaVerifierRef.current = verifier;

      const fullPhoneNumber = `+20${phoneNumber.trim()}`;
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
      
      confirmationResultRef.current = result;

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
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'تسجيل الدخول بالهاتف غير مفعل. يرجى تفعيله من لوحة تحكم Firebase.';
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'فشل إرسال الرمز', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResultRef.current) {
      setError("لم يتم طلب رمز التحقق أو انتهت صلاحيته. الرجاء طلب الرمز أولاً.");
      return;
    }
    if (otp.length !== 6) {
      setError('الرجاء إدخال رمز التحقق المكون من 6 أرقام.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await confirmationResultRef.current.confirm(otp);
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحبًا بك في متجرنا!',
      });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      let errorMessage = 'رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى.';
      if (err.code === 'auth/invalid-verification-code') {
          errorMessage = 'رمز التحقق الذي أدخلته غير صالح.';
      } else if (err.code === 'auth/code-expired') {
          errorMessage = 'انتهت صلاحية الرمز. الرجاء طلب رمز جديد.'
      }
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'فشل التحقق', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setIsOtpSent(false); 
    setError(null);
    setOtp('');
    // Do not clear phone number to allow easy retry
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-muted/20 py-12">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">تسجيل الدخول أو إنشاء حساب</CardTitle>
          <CardDescription>استخدم رقم هاتفك للوصول إلى حسابك.</CardDescription>
        </CardHeader>
        <CardContent>
          <div id={recaptchaContainerId}></div>
          
          {!isOtpSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف (مصر)</Label>
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
                      className="rounded-l-none"
                    />
                </div>
              </div>
              
              <Button onClick={handleSendOtp} className="w-full font-bold" disabled={isLoading || !phoneNumber}>
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
              <Button variant="link" onClick={resetState} className="w-full">
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
