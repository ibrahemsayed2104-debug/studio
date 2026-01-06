
export type GalleryItem = {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
  aspectRatio?: string; // e.g., '16/9', '3/4'
};

export const galleryImages: { [key: string]: GalleryItem[] } = {
  gallery: [
    { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1615875617371-6c434c568525?q=80&w=1932', hint: 'beige curtain', type: 'image', aspectRatio: '4/5' },
    { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1595265010264-c15786ca6c5a?q=80&w=1974', hint: 'burgundy curtain', type: 'image', aspectRatio: '2/3' },
    { id: 'gallery-3', url: 'https://images.unsplash.com/photo-1601758124578-82559a4631fb?q=80&w=1974', hint: 'green curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'gallery-4', url: 'https://images.unsplash.com/photo-1533227475286-fecb4b4f9a48?q=80&w=2070', hint: 'grey curtain', type: 'image', aspectRatio: '2/3' },
    { id: 'gallery-5', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070', hint: 'white interior', type: 'image', aspectRatio: '3/4' },
    { id: 'gallery-6', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070', hint: 'luxury livingroom', type: 'image', aspectRatio: '2/3' },
    { id: 'gallery-7', url: 'https://images.unsplash.com/photo-1631679704834-315967d7d860?q=80&w=1974', hint: 'modern drapes', type: 'image', aspectRatio: '3/4' },
    { id: 'gallery-8', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f458?q=80&w=1974', hint: 'bedroom curtain', type: 'image', aspectRatio: '2/3' }
  ],
  videos: [
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', hint: 'curtain showcase', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', hint: 'curtain detail', type: 'video', aspectRatio: '16/9' },
  ]
};
