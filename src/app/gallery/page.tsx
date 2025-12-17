'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Loader2, CameraOff } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 800;

interface GalleryImage {
  id: number;
  url: string;
}

const fetchImages = (page: number, count = 12): GalleryImage[] => {
  const images: GalleryImage[] = [];
  const seedOffset = (page - 1) * count;
  for (let i = 0; i < count; i++) {
    const seed = seedOffset + i + 1;
    images.push({
      id: seed,
      url: `https://picsum.photos/seed/${seed}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`,
    });
  }
  return images;
};

export default function GalleryPage() {
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newImages = fetchImages(page);

    if (newImages.length === 0) {
      setHasMore(false);
    } else {
      setImages(prevImages => [...prevImages, ...newImages]);
      setPage(prevPage => prevPage + 1);
    }
    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    if (inView && !isLoading) {
      loadMoreImages();
    }
  }, [inView, loadMoreImages, isLoading]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          معرض الصور
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          استكشف أحدث التصاميم والإلهامات من مجموعاتنا المختارة.
        </p>
      </div>

      {images.length === 0 && isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map(image => (
          <div key={image.id} className="break-inside-avoid">
            <div className="relative w-full rounded-lg overflow-hidden shadow-lg group border transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <Image
                src={image.url}
                alt={`Gallery image ${image.id}`}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                className="object-cover w-full h-auto"
                priority={image.id <= 12} // Prioritize loading first batch
                data-ai-hint="curtain design"
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