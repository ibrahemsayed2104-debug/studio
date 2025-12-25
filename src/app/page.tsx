import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { galleryImages } from '@/lib/gallery-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'room-1');
  const gallerySelection = [
    ...galleryImages.classic.slice(0, 2),
    ...galleryImages.modern.slice(0, 2),
    ...galleryImages.hotel.slice(0, 2),
    ...galleryImages.roman.slice(0, 2),
  ];

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold !text-white tracking-tight leading-tight">
            فن الأناقة لمنزلك
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl font-body !text-gray-200">
            اكتشف مجموعتنا المختارة من الستائر الفاخرة المصممة لإضفاء الجمال والدفء على مساحتك.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/gallery">تصفح المعرض</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/virtual-mockup">جرّبها في منزلك</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">معرض أعمالنا</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              استلهم من مجموعتنا المتنوعة من التصاميم الكلاسيكية والعصرية التي تناسب كل ذوق.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallerySelection.map((item, index) => (
              <Link href="/gallery" key={item.id} className={`group relative block overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${index === 0 || index === gallerySelection.length - 1 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <div className="relative w-full h-full" style={{ aspectRatio: (index === 0 || index === gallerySelection.length - 1) ? '1/1' : '3/4' }}>
                    <Image
                      src={item.url}
                      alt={item.hint}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      data-ai-hint={item.hint}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 right-4 text-white">
                    <h3 className="font-headline text-lg font-semibold">{item.hint.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h3>
                </div>
              </Link>
            ))}
          </div>
           <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/gallery">عرض المزيد من التصاميم</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
