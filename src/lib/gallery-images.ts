
export type GalleryItem = {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
  aspectRatio?: string; // e.g., '16/9', '3/4'
};

export const galleryImages: { [key: string]: GalleryItem[] } = {
  classic: [
    { id: 'cl-1', url: 'https://images.unsplash.com/photo-1604242667356-cb081702811a?w=800&q=80', hint: 'classic curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'cl-2', url: 'https://images.unsplash.com/photo-1595265010264-c15786ca6c5a?w=800&q=80', hint: 'elegant drape', type: 'image', aspectRatio: '4/3' },
    { id: 'cl-3', url: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&q=80', hint: 'luxury curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'cl-4', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f458?w=800&q=80', hint: 'vintage curtain', type: 'image', aspectRatio: '3/4' },
  ],
  roman: [
    { id: 'ro-1', url: 'https://images.unsplash.com/photo-1560520444-2c3b0d4d66c3?w=800&q=80', hint: 'roman shade', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-2', url: 'https://images.unsplash.com/photo-1621689252329-8e5f1b4b1a4a?w=800&q=80', hint: 'window blind', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-3', url: 'https://images.unsplash.com/photo-1533777857889-45b90b51884a?w=800&q=80', hint: 'elegant roman', type: 'image', aspectRatio: '3/4' },
    { id: 'ro-4', url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80', hint: 'kitchen window', type: 'image', aspectRatio: '3/4' },
  ],
  hotel: [
    { id: 'ho-1', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', hint: 'hotel curtain', type: 'image', aspectRatio: '16/9' },
    { id: 'ho-2', url: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80', hint: 'hotel room', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-3', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', hint: 'luxury hotel', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-4', url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', hint: 'blackout curtain', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-9', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', hint: 'modern hotel', type: 'image', aspectRatio: '4/3' },
  ],
  modern: [
    { id: 'mo-1', url: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?w=800&q=80', hint: 'modern curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'mo-2', url: 'https://images.unsplash.com/photo-1594042533221-a44c41464358?w=800&q=80', hint: 'layered curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-3', url: 'https://images.unsplash.com/photo-1571672346827-ee4040cdd7d8?w=800&q=80', hint: 'blue curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-4', url: 'https://images.unsplash.com/photo-1493663671943-2e38c105cda6?w=800&q=80', hint: 'living room', type: 'image', aspectRatio: '3/4' },
    { id: 'mo-5', url: 'https://images.unsplash.com/photo-1522708323590-d2400b6b615c?w=800&q=80', hint: 'patterned curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-6', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', hint: 'contemporary curtain', type: 'image', aspectRatio: '4/3' },
  ],
  videos: [
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', hint: 'curtain showcase', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', hint: 'curtain detail', type: 'video', aspectRatio: '16/9' },
  ]
};
