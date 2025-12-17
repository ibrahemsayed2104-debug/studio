'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirect);
    }
  }, [user, isUserLoading, router, redirect]);
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
      
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
        description: "فشل تسجيل الدخول باستخدام Google. الرجاء المحاولة مرة أخرى.",
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
        <CardContent>
          <Button onClick={handleGoogleSignIn} className="w-full font-bold" variant="outline">
            <FcGoogle className="me-3 h-5 w-5" />
            المتابعة باستخدام Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
