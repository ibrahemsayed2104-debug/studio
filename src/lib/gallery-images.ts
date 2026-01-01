
export type GalleryItem = {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
  aspectRatio?: string; // e.g., '16/9', '3/4'
};

const generateGalleryImages = (count: number): GalleryItem[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `gallery-${i + 1}`,
        url: `https://picsum.photos/seed/${100 + i}/800/600`,
        hint: 'curtain',
        type: 'image',
        aspectRatio: ['4/3', '3/4', '1/1'][i % 3],
    }));
};

export const galleryImages: { [key: string]: GalleryItem[] } = {
  gallery: [
    { id: 'cl-1', url: 'https://zeuniform.com/wp-content/uploads/2024/03/F73FTtGXQAAcy2G.jpg', hint: 'classic curtain', type: 'image', aspectRatio: '4/3' },
    { id: 'cl-2', url: 'https://i.pinimg.com/originals/f2/02/b6/f202b66236528753d0693198083a544f.jpg', hint: 'elegant drape', type: 'image', aspectRatio: '3/4' },
    { id: 'cl-3', url: 'https://i.pinimg.com/736x/d4/0e/a3/d40ea3f350834335f6399b1a03a7431e.jpg', hint: 'luxury curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'cl-4', url: 'https://www.alhabibshop.com/wp-content/uploads/2021/11/curtains-classic-2-scaled-1.jpg', hint: 'vintage curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-1', url: 'https://images.unsplash.com/photo-1615875605825-5eb9bb5fea38?w=800&h=800&fit=crop', hint: 'roman shade', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-2', url: 'https://images.unsplash.com/photo-1593574763261-916a8d38b6a3?w=800&h=800&fit=crop', hint: 'window blind', type: 'image', aspectRatio: '1/1' },
    { id: 'ho-1', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbb563?w=1200&h=675&fit=crop', hint: 'hotel curtain', type: 'image', aspectRatio: '16/9' },
    { id: 'ho-2', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', hint: 'hotel room', type: 'image', aspectRatio: '4/3' },
    { id: 'mo-1', url: 'https://images.unsplash.com/photo-1502014382-959959224c65?w=600&h=800&fit=crop', hint: 'modern curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'mo-2', url: 'https://images.unsplash.com/photo-1616047003024-f72a44199127?w=800&h=800&fit=crop', hint: 'layered curtain', type: 'image', aspectRatio: '1/1' },
    ...generateGalleryImages(20)
  ],
  videos: [
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', hint: 'curtain showcase', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', hint: 'curtain detail', type: 'video', aspectRatio: '16/9' },
  ]
};
