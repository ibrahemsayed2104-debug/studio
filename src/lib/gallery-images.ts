
export type GalleryItem = {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
  aspectRatio?: string; // e.g., '16/9', '3/4'
};

// IMPORTANT: After this change, you need to add your images to the `public` folder.
// Create a folder structure like this:
// public/gallery/classic/1.jpg
// public/gallery/roman/1.jpg
// ...and so on.

export const galleryImages: { [key: string]: GalleryItem[] } = {
  classic: [
    { id: 'cl-1', url: '/gallery/classic/1.jpg', hint: 'classic curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'cl-2', url: '/gallery/classic/2.jpg', hint: 'elegant drape', type: 'image', aspectRatio: '4/3' },
    { id: 'cl-3', url: '/gallery/classic/3.jpg', hint: 'luxury curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'cl-4', url: '/gallery/classic/4.jpg', hint: 'vintage curtain', type: 'image', aspectRatio: '3/4' },
  ],
  roman: [
    { id: 'ro-1', url: '/gallery/roman/1.jpg', hint: 'roman shade', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-2', url: '/gallery/roman/2.jpg', hint: 'window blind', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-3', url: '/gallery/roman/3.jpg', hint: 'elegant roman', type: 'image', aspectRatio: '3/4' },
    { id: 'ro-4', url: '/gallery/roman/4.jpg', hint: 'kitchen window', type: 'image', aspectRatio: '3/4' },
  ],
  hotel: [
    { id: 'ho-1', url: '/gallery/hotel/1.jpg', hint: 'hotel curtain', type: 'image', aspectRatio: '16/9' },
    { id: 'ho-2', url: '/gallery/hotel/2.jpg', hint: 'hotel room', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-3', url: '/gallery/hotel/3.jpg', hint: 'luxury hotel', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-4', url: '/gallery/hotel/4.jpg', hint: 'blackout curtain', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-9', url: '/gallery/hotel/5.jpg', hint: 'modern hotel', type: 'image', aspectRatio: '4/3' },
  ],
  modern: [
    { id: 'mo-1', url: '/gallery/modern/1.jpg', hint: 'modern curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'mo-2', url: '/gallery/modern/2.jpg', hint: 'layered curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-3', url: '/gallery/modern/3.jpg', hint: 'blue curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-4', url: '/gallery/modern/4.jpg', hint: 'living room', type: 'image', aspectRatio: '3/4' },
    { id: 'mo-5', url: '/gallery/modern/5.jpg', hint: 'patterned curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-6', url: '/gallery/modern/6.jpg', hint: 'contemporary curtain', type: 'image', aspectRatio: '4/3' },
  ],
  videos: [
      // Videos are still loaded from an external URL
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', hint: 'curtain showcase', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', hint: 'curtain detail', type: 'video', aspectRatio: '16/9' },
  ]
};
