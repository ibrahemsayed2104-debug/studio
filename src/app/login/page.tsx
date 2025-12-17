'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useAuth, useUser, setDocumentNonBlocking, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirect);
    }
  }, [user, isUserLoading, router, redirect]);

  useEffect(() => {
    if (auth && recaptchaContainerRef.current && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [auth]);

  const saveUserToFirestore = (user: any) => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
    };
    setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if(!auth) return;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      saveUserToFirestore(user);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك، ${user.displayName}!`,
      });

      router.replace(redirect);
    } catch (error: any) {
      console.error("Authentication Error:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.code === 'auth/popup-closed-by-user' 
          ? 'تم إلغاء عملية تسجيل الدخول.'
          : 'فشل تسجيل الدخول باستخدام Google. الرجاء المحاولة مرة أخرى.',
      });
    }
  };

  const handlePhoneSignIn = async () => {
    if (!window.recaptchaVerifier || !auth) {
      toast({ variant: "destructive", title: "خطأ", description: "لم يتم تهيئة reCAPTCHA بشكل صحيح." });
      return;
    }

    try {
      let formattedPhoneNumber = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        // Assuming numbers starting with 0 are local Egyptian numbers
        if (phoneNumber.startsWith('0')) {
          formattedPhoneNumber = '+2' + phoneNumber;
        } else {
          // Assuming numbers without 0 are also Egyptian numbers needing the code
          formattedPhoneNumber = '+20' + phoneNumber;
        }
      }

      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({ title: "تم إرسال الرمز", description: `تم إرسال رمز التحقق إلى ${formattedPhoneNumber}.` });
    } catch (error: any) {
      console.error("Phone Auth Error:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "فشل إرسال رمز التحقق. تأكد من صحة الرقم والمحاولة مرة أخرى.",
      });
      // Reset reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
            grecaptcha.reset(widgetId);
          }
        });
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (!confirmationResult) return;
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      saveUserToFirestore(user);

      toast({ title: "تم تسجيل الدخول بنجاح", description: `مرحباً بك!` });
      router.replace(redirect);
    } catch (error: any) {
      console.error("OTP Error:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التحقق",
        description: "رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى.",
      });
    }
  };

  if (isUserLoading || user) {
    return <div className="container text-center py-20">جاري التحميل...</div>;
  }

  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">تسجيل الدخول</CardTitle>
          <CardDescription>
            سجّل الدخول للوصول إلى طلباتك وإتمام عمليات الشراء بشكل أسرع.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {!isOtpSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="01xxxxxxxxx" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handlePhoneSignIn} className="w-full font-bold">
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
                    placeholder="ادخل الرمز المكون من 6 أرقام" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <Button onClick={handleOtpSubmit} className="w-full font-bold">
                  تأكيد الدخول
                </Button>
                <Button variant="link" onClick={() => setIsOtpSent(false)}>
                  تغيير رقم الهاتف
                </Button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                أو
              </span>
            </div>
          </div>

          <Button onClick={handleGoogleSignIn} className="w-full font-bold" variant="outline">
            <FcGoogle className="me-3 h-5 w-5" />
            المتابعة باستخدام Google
          </Button>
        </CardContent>
      </Card>
      <div ref={recaptchaContainerRef}></div>
    </div>
  );
}

// Add this to your global types or a declarations file if it doesn't exist
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: any;
  }
}
