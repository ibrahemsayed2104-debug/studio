'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Loader2, CameraOff, GalleryVertical } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 800;

interface GalleryImage {
  id: number;
  url: string;
}

const categories = [
  { id: 'classic', name: 'كلاسيك', searchTerm: 'classic curtain' },
  { id: 'roman', name: 'روماني', searchTerm: 'roman shade' },
  { id: 'hotel', name: 'فندقية', searchTerm: 'hotel curtain' },
  { id: 'office', name: 'مكاتب', searchTerm: 'office blind' },
];

const fetchImages = (searchTerm: string, page: number, count = 9): GalleryImage[] => {
  const images: GalleryImage[] = [];
  const seedOffset = (page - 1) * count;
  for (let i = 0; i < count; i++) {
    const seed = seedOffset + i + 1;
    images.push({
      id: seed,
      url: `https://picsum.photos/seed/${searchTerm}${seed}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`,
    });
  }
  return images;
};

function GalleryCategory({ category }: { category: { id: string, name: string, searchTerm: string } }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadMoreImages = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newImages = fetchImages(category.searchTerm, page);

    if (newImages.length === 0) {
      setHasMore(false);
    } else {
      setImages(prevImages => [...prevImages, ...newImages]);
      setPage(prevPage => prevPage + 1);
    }
    setIsLoading(false);
  }, [page, isLoading, hasMore, category.searchTerm]);

  useEffect(() => {
    // Initial load for the category
    loadMoreImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (inView && !isLoading) {
      loadMoreImages();
    }
  }, [inView, loadMoreImages, isLoading]);

  return (
    <div>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {images.map(image => (
          <div key={`${category.id}-${image.id}`} className="break-inside-avoid">
            <div className="relative w-full rounded-lg overflow-hidden shadow-lg group border transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <Image
                src={image.url}
                alt={`${category.name} curtain design ${image.id}`}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                className="object-cover w-full h-auto"
                priority={image.id <= 9}
                data-ai-hint={category.searchTerm}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <div ref={ref} className="h-20 flex justify-center items-center mt-8">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {!hasMore && images.length > 0 && (
          <div className="text-center text-muted-foreground">
            <CameraOff className="mx-auto h-8 w-8" />
            <p className="mt-2">لقد وصلت إلى نهاية المعرض.</p>
          </div>
        )}
      </div>
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
            <GalleryCategory category={category} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
