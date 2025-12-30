'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryVertical, X, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { galleryImages, type GalleryItem } from '@/lib/gallery-images';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'classic', name: 'كلاسيك', images: galleryImages.classic },
  { id: 'roman', name: 'روماني', images: galleryImages.roman },
  { id: 'hotel', name: 'فندقية', images: galleryImages.hotel },
  { id: 'modern', name: 'مودرن', images: galleryImages.modern },
  { id: 'videos', name: 'فيديوهات', images: galleryImages.videos },
];

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const renderGridItem = (item: GalleryItem) => {
    return (
        <button
          key={item.id}
          onClick={() => setSelectedItem(item)}
          className="group relative block w-full overflow-hidden rounded-lg border bg-muted shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
        >
            <div
                className="w-full h-full"
                style={{ aspectRatio: item.aspectRatio || '1' }}
            >
                {item.type === 'video' ? (
                    <video
                        src={item.url}
                        className="h-full w-full object-cover"
                        playsInline
                        muted
                        loop
                        autoPlay
                    />
                ) : (
                    <Image
                        src={item.url}
                        alt={`${item.hint} design ${item.id}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        data-ai-hint={item.hint}
                    />
                )}
            </div>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {item.type === 'video' && <Video className="h-12 w-12 text-white" />}
            </div>
        </button>
    );
};


  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4">
            <GalleryVertical className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
              معرض الصور والفيديوهات
            </h1>
          </div>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            استكشف أحدث التصاميم، الإلهامات، والفيديوهات التوضيحية من مجموعاتنا المختارة.
          </p>
        </div>

        <Tabs defaultValue={categories[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} forceMount={false}>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {category.images.map((item) => (
                  <div key={item.id} className="break-inside-avoid">
                    {renderGridItem(item)}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-5xl h-[90vh] p-2 sm:p-4 bg-transparent border-0 shadow-none flex items-center justify-center">
            <DialogTitle className="sr-only">عرض مكبر للمحتوى</DialogTitle>
            <div className="relative w-full h-full">
                {selectedItem?.type === 'image' && (
                    <Image
                        src={selectedItem.url}
                        alt="Enlarged gallery view"
                        fill
                        className="object-contain"
                    />
                )}
                 {selectedItem?.type === 'video' && (
                    <video
                        src={selectedItem.url}
                        className="object-contain w-full h-full"
                        controls
                        autoPlay
                        loop
                    />
                )}
            </div>
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 text-white rounded-full z-50"
                aria-label="Close view"
             >
                <X className="h-6 w-6" />
             </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
