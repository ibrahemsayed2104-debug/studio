
'use client';

import Image from 'next/image';
import { GalleryVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { galleryImages } from '@/lib/gallery-images';

const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 1000;

interface GalleryImage {
  id: string;
  url: string;
  hint: string;
}

const categories = [
  { id: 'classic', name: 'كلاسيك', images: galleryImages.classic },
  { id: 'roman', name: 'روماني', images: galleryImages.roman },
  { id: 'hotel', name: 'فندقية', images: galleryImages.hotel },
  { id: 'office', name: 'مكاتب', images: galleryImages.office },
];

function GalleryCategory({ images, categoryName }: { images: GalleryImage[], categoryName: string }) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map(image => (
        <div key={image.id} className="break-inside-avoid">
          <div className="relative w-full rounded-lg overflow-hidden shadow-lg group border transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <Image
              src={image.url}
              alt={`${categoryName} curtain design ${image.id}`}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              className="object-cover w-full h-auto"
              priority={images.indexOf(image) < 8}
              data-ai-hint={image.hint}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4">
          <GalleryVertical className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            معرض الصور
          </h1>
        </div>
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
          <TabsContent key={category.id} value={category.id}>
            <GalleryCategory images={category.images} categoryName={category.name} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
