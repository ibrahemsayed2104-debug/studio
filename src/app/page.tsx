import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { PRODUCTS } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'room-1');

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
              <Link href="#products">تصفح المجموعة</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/virtual-mockup">جرّبها في منزلك</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">مجموعتنا المميزة</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              صُنعت كل ستارة بعناية فائقة، حيث تجتمع الجودة العالية مع التصميم الفريد.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
