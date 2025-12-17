"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, Upload, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { virtualCurtainMockup } from '@/ai/flows/virtual-curtain-mockup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PRODUCTS } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

async function imageUrlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


export function VirtualMockupTool() {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [selectedCurtainId, setSelectedCurtainId] = useState<string>(PRODUCTS[0].id);
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMockupImage(null);
      setError(null);
      try {
        const base64Image = await toBase64(file);
        setRoomImage(base64Image);
      } catch (err) {
        setError('فشل في قراءة الصورة. الرجاء المحاولة مرة أخرى.');
        toast({ variant: 'destructive', title: 'خطأ', description: 'فشل في قراءة الصورة.' });
      }
    }
  };

  const handleGenerateMockup = async () => {
    if (!roomImage || !selectedCurtainId) {
      setError('الرجاء رفع صورة للغرفة واختيار ستارة.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMockupImage(null);

    const selectedCurtain = PRODUCTS.find(p => p.id === selectedCurtainId);
    if (!selectedCurtain) {
        setError('الستارة المحددة غير موجودة.');
        setIsLoading(false);
        return;
    }
    
    try {
        const curtainImageBase64 = await imageUrlToBase64(selectedCurtain.image);

        const result = await virtualCurtainMockup({
            roomImage: roomImage,
            curtainImage: curtainImageBase64,
        });

        if (result.mockupImage) {
            setMockupImage(result.mockupImage);
        } else {
            throw new Error("لم يتمكن الذكاء الاصطناعي من إنشاء الصورة.");
        }
    } catch (err: any) {
        const errorMessage = err.message || 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.';
        setError(errorMessage);
        toast({ variant: 'destructive', title: 'خطأ في الإنشاء', description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">أدوات التصميم</CardTitle>
          <CardDescription>الخطوة 1: قم بإعداد الغرفة والستارة.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="font-medium">اختر الستارة</label>
            <Select value={selectedCurtainId} onValueChange={setSelectedCurtainId}>
              <SelectTrigger>
                <SelectValue placeholder="اختر تصميم ستارة" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCTS.map(curtain => (
                  <SelectItem key={curtain.id} value={curtain.id}>
                    {curtain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCurtainId && (
                <div className="relative h-40 w-full rounded-md overflow-hidden border p-2 bg-muted/50 mt-2">
                    <Image 
                        src={PRODUCTS.find(p => p.id === selectedCurtainId)?.image || ''} 
                        alt="Selected curtain" 
                        fill 
                        className="object-contain" 
                    />
                </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-medium">صورة غرفتك</label>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Upload className="ms-2 h-4 w-4" />
              ارفع صورة من جهازك
            </Button>
            {roomImage && (
                <div className="relative h-40 w-full rounded-md overflow-hidden border p-2 bg-muted/50 mt-2">
                    <Image src={roomImage} alt="Uploaded room" fill className="object-contain" />
                </div>
            )}
          </div>
          <Button onClick={handleGenerateMockup} disabled={isLoading || !roomImage} className="w-full font-bold">
            {isLoading ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : <Sparkles className="ms-2 h-4 w-4" />}
            {isLoading ? 'جاري الإنشاء...' : 'أنشئ التصور'}
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">الخطوة 2: شاهد النتيجة</CardTitle>
          <CardDescription>هنا سيظهر تصور الستارة في غرفتك.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[calc(100%-8rem)]">
          {isLoading && (
            <div className="text-center text-muted-foreground">
              <Loader2 className="mx-auto h-12 w-12 animate-spin" />
              <p className="mt-4">يقوم الذكاء الاصطناعي بعمله... قد يستغرق هذا بعض الوقت.</p>
            </div>
          )}
          {error && !isLoading && (
             <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>حدث خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && mockupImage && (
            <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-primary shadow-lg">
                <Image src={mockupImage} alt="Virtual mockup of curtain in room" fill className="object-cover" />
            </div>
          )}
          {!isLoading && !error && !mockupImage && (
            <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg w-full h-full flex flex-col justify-center items-center">
                <ImageIcon className="h-12 w-12" />
                <p className="mt-4 max-w-xs">ستظهر الصورة المُنشأة هنا. ارفع صورة غرفتك واختر ستارة لتبدأ.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
