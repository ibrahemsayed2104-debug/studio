
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
  ],
  videos: [
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', hint: 'curtain showcase', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', hint: 'curtain detail', type: 'video', aspectRatio: '16/9' },
  ]
};
