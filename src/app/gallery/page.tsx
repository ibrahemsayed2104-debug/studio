
'use client';

import Image from 'next/image';
import { GalleryVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { galleryImages } from '@/lib/gallery-images';

const categories = [
  { id: 'classic', name: 'كلاسيك', images: galleryImages.classic },
  { id: 'roman', name: 'روماني', images: galleryImages.roman },
  { id: 'hotel', name: 'فندقية', images: galleryImages.hotel },
  { id: 'modern', name: 'مودرن', images: galleryImages.modern },
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4">
          <GalleryVertical className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            معرض الصور
          </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          استكشف أحدث التصاميم والإلهامات من مجموعاتنا المختارة حسب الفئة.
        </p>
      </div>

      <Tabs defaultValue={categories[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} forceMount={false}>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {category.images.map((image, index) => (
                <div key={image.id} className="break-inside-avoid">
                  <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-lg group border transition-all duration-300 hover:shadow-2xl hover:scale-105">
                    <Image
                      src={image.url}
                      alt={`${category.name} curtain design ${image.id}`}
                      width={800}
                      height={1000}
                      className="object-cover w-full h-auto"
                      priority={index < 4}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      data-ai-hint={image.hint}
                      unoptimized={false}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
