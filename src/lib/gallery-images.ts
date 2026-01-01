
export type GalleryItem = {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
  aspectRatio?: string; // e.g., '16/9', '3/4'
};

export const galleryImages: { [key: string]: GalleryItem[] } = {
  gallery: [
    { id: 'cl-1', url: 'https://zeuniform.com/wp-content/uploads/2024/03/F73FTtGXQAAcy2G.jpg', hint: 'classic curtain', type: 'image', aspectRatio: '4/3' },
    { id: 'cl-2', url: 'https://i.pinimg.com/originals/f2/02/b6/f202b66236528753d0693198083a544f.jpg', hint: 'elegant drape', type: 'image', aspectRatio: '3/4' },
    { id: 'cl-3', url: 'https://www.alhabibshop.com/wp-content/uploads/2021/11/curtains-classic-2-scaled-1.jpg', hint: 'luxury curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'cl-4', url: 'https://i.pinimg.com/736x/d4/0e/a3/d40ea3f350834335f6399b1a03a7431e.jpg', hint: 'vintage curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'mod-1', url: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&q=80', hint: 'modern curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'mod-2', url: 'https://images.unsplash.com/photo-1533227475286-fecb4b4f9a48?w=800&q=80', hint: 'living room curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'rom-1', url: 'https://images.unsplash.com/photo-1617325247834-a6314b14c72a?w=800&q=80', hint: 'roman shade', type: 'image', aspectRatio: '3/4' },
    { id: 'rom-2', url: 'https://images.unsplash.com/photo-1615875617371-6c434c568525?w=800&q=80', hint: 'bedroom curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'htl-1', url: 'https://images.unsplash.com/photo-1631699569324-a536bce26017?w=800&q=80', hint: 'hotel curtain', type: 'image', aspectRatio: '4/3' },
    { id: 'htl-2', url: 'https://images.unsplash.com/photo-1595341634224-d1d7b05a764b?w=800&q=80', hint: 'luxury drape', type: 'image', aspectRatio: '3/4' },
    { id: 'gen-1', url: 'https://images.unsplash.com/photo-1563293998-c39356f5c8f8?w=800&q=80', hint: 'sheer curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'gen-2', url: 'https://images.unsplash.com/photo-1613917808316-d3a3b0a2a4c2?w=800&q=80', hint: 'patterned curtain', type: 'image', aspectRatio: '3/4' }
  ],
  videos: [
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', hint: 'curtain showcase', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', hint: 'curtain detail', type: 'video', aspectRatio: '16/9' },
  ]
};
