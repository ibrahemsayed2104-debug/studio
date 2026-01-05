'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { GalleryVertical, X, Video, Image as ImageIcon, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { galleryImages, type GalleryItem } from '@/lib/gallery-images';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SelectedItem = {
    item: GalleryItem;
    index: number;
    category: 'gallery' | 'videos';
};

const categories = [
  { id: 'gallery', name: 'المعرض', icon: ImageIcon, images: galleryImages.gallery },
  { id: 'videos', name: 'فيديوهات', icon: Video, images: galleryImages.videos },
] as const;

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentImageList = useMemo(() => {
    if (!selectedItem) return [];
    return categories.find(c => c.id === selectedItem.category)?.images || [];
  }, [selectedItem]);

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (!selectedItem) return;
    const imageList = currentImageList;
    let newIndex;
    if (direction === 'next') {
      newIndex = (selectedItem.index + 1) % imageList.length;
    } else {
      newIndex = (selectedItem.index - 1 + imageList.length) % imageList.length;
    }
    setSelectedItem({
      item: imageList[newIndex],
      index: newIndex,
      category: selectedItem.category,
    });
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const handleItemClick = (item: GalleryItem, index: number, category: 'gallery' | 'videos') => {
    setSelectedItem({ item, index, category });
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.currentTarget.classList.add('cursor-grabbing');
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const onMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    e.currentTarget.classList.remove('cursor-grabbing');
  };
  
  const onMouseLeave = (e: React.MouseEvent) => {
    if (isDragging) {
        setIsDragging(false);
        e.currentTarget.classList.remove('cursor-grabbing');
    }
  };


  const renderGridItem = (item: GalleryItem, index: number, category: 'gallery' | 'videos') => {
    return (
        <button
          key={item.id}
          onClick={() => handleItemClick(item, index, category)}
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
                {item.type === 'video' ? 
                    <Video className="h-12 w-12 text-white" /> :
                    <ImageIcon className="h-12 w-12 text-white" />
                }
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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="gap-2">
                <category.icon className="h-5 w-5"/>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} forceMount={false}>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {category.images.map((item, index) => (
                  <div key={item.id} className="break-inside-avoid">
                    {renderGridItem(item, index, category.id as 'gallery' | 'videos')}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent 
            className="max-w-none w-screen h-screen p-0 sm:p-0 bg-black/80 border-0 shadow-none flex items-center justify-center"
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <DialogTitle className="sr-only">عرض مكبر للمحتوى</DialogTitle>
            
            <div 
              className="relative w-full h-full overflow-hidden"
            >
                {selectedItem?.item.type === 'image' && (
                    <Image
                        src={selectedItem.item.url}
                        alt="Enlarged gallery view"
                        fill
                        className={cn(
                          "object-contain transition-transform duration-300",
                          zoom > 1 ? 'cursor-grab' : 'cursor-auto'
                        )}
                        style={{
                            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                        }}
                        onMouseDown={onMouseDown}
                    />
                )}
                 {selectedItem?.item.type === 'video' && (
                    <video
                        src={selectedItem.item.url}
                        className="object-contain w-full h-full"
                        controls
                        autoPlay
                        loop
                    />
                )}
            </div>
            
            {/* Controls */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setSelectedItem(null)}
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                    aria-label="Close view"
                >
                    <X className="h-6 w-6" />
                </Button>
                {selectedItem?.item.type === 'image' && (
                  <>
                    <Button variant="secondary" size="icon" onClick={() => setZoom(z => Math.min(z + 0.5, 5))} className="bg-black/50 hover:bg-black/70 text-white rounded-full"><ZoomIn className="h-6 w-6" /></Button>
                    <Button variant="secondary" size="icon" onClick={() => setZoom(z => Math.max(z - 0.5, 1))} className="bg-black/50 hover:bg-black/70 text-white rounded-full"><ZoomOut className="h-6 w-6" /></Button>
                  </>
                )}
            </div>
            
            {/* Navigation */}
            <Button
                variant="secondary"
                size="icon"
                onClick={() => handleNavigation('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 z-50"
                aria-label="Previous"
            >
                <ArrowLeft className="h-7 w-7" />
            </Button>
            <Button
                variant="secondary"
                size="icon"
                onClick={() => handleNavigation('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 z-50"
                aria-label="Next"
            >
                <ArrowRight className="h-7 w-7" />
            </Button>

        </DialogContent>
      </Dialog>
    </>
  );
}
