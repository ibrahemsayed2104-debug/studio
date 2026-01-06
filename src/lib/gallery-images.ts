
export type GalleryItem = {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
  aspectRatio?: string; // e.g., '16/9', '3/4'
};

export const galleryImages: { [key: string]: GalleryItem[] } = {
  gallery: [
    { id: 'new-1', url: 'https://m.media-amazon.com/images/I/71u9S+tRrJL._AC_SL1500_.jpg', hint: 'velvet curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'new-2', url: 'https://m.media-amazon.com/images/I/61kGFFfbd2L._AC_SL1500_.jpg', hint: 'textured curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'new-3', url: 'https://m.media-amazon.com/images/I/71fD+sXzJQL._AC_SL1500_.jpg', hint: 'grommet curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'new-4', url: 'https://m.media-amazon.com/images/I/71d1xDw9rJL._AC_SL1500_.jpg', hint: 'dark curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'new-5', url: 'https://m.media-amazon.com/images/I/61M6K5J2f4L._AC_SL1500_.jpg', hint: 'patterned curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'new-6', url: 'https://www.ef-curtain.com/wp-content/uploads/2021/04/%D8%B3%D8%AA%D8%A7%D8%A6%D8%B1-%D8%B1%D9%88%D9%84-eichholtz-2.jpg', hint: 'roll curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'new-7', url: 'https://i.postimg.cc/135X7RNH/2023-42.jpg', hint: 'modern drapes', type: 'image', aspectRatio: '1/1' },
    { id: 'new-8', url: 'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/09/802874/1.jpg?1487', hint: 'linen curtain', type: 'image', aspectRatio: '1/1' }
  ],
  videos: [
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', hint: 'curtain showcase', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', hint: 'curtain detail', type: 'video', aspectRatio: '16/9' },
  ]
};
