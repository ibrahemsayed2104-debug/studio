
export type GalleryItem = {
  id: string;
  url: string;
  hint: string;
  type: 'image' | 'video';
  aspectRatio?: string; // e.g., '16/9', '3/4'
};

export const galleryImages: { [key: string]: GalleryItem[] } = {
  classic: [
    { id: 'cl-1', url: 'https://beytk.net/wp-content/uploads/2023/11/%D8%B3%D8%AA%D8%A7%D8%A6%D8%B1-%D9%83%D9%84%D8%A7%D8%B3%D9%8A%D9%83-%D9%81%D8%AE%D9%85%D8%A9-%D9%84%D9%84%D8%B5%D8%A7%D9%84%D9%88%D9%86-3.jpg', hint: 'classic curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'cl-2', url: 'https://decor30.com/wp-content/uploads/2019/03/%D8%A7%D8%AD%D8%AF%D8%AB-%D8%B3%D8%AA%D8%A7%D8%A6%D8%B1-%D9%83%D9%84%D8%A7%D8%B3%D9%8A%D9%83-%D9%84%D9%84%D8%B5%D8%A7%D9%84%D9%88%D9%86%D8%A7%D8%AA-2018.jpg', hint: 'elegant drape', type: 'image', aspectRatio: '4/3' },
    { id: 'cl-3', url: 'https://www.aldecor.com/wp-content/uploads/2018/07/Curtains-58.jpg', hint: 'luxury curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'cl-4', url: 'https://www.aldecor.com/wp-content/uploads/2018/07/Curtains-23.jpg', hint: 'vintage curtain', type: 'image', aspectRatio: '3/4' },
  ],
  roman: [
    { id: 'ro-1', url: 'https://sadafaldar.com/wp-content/uploads/2022/08/%D8%B3%D8%AA%D8%A7%D8%A6%D8%B1-%D8%B1%D9%88%D9%85%D8%A7%D9%86%D9%8A-%D8%B5%D8%AF%D9%81-%D8%A7%D9%84%D8%AF%D8%A7%D8%B1-%D9%84%D9%84%D8%B3%D8%AA%D8%A7%D8%A6%D8%B1-4.jpeg', hint: 'roman shade', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-2', url: 'https://www.aljazeeracoonline.com/wp-content/uploads/2024/07/%D8%B1%D9%88%D9%85%D8%A7%D9%86%D9%8A-1024x1024.webp', hint: 'window blind', type: 'image', aspectRatio: '1/1' },
    { id: 'ro-3', url: 'http://files.lahlooba.net/2012/05/180/7.jpg', hint: 'elegant roman', type: 'image', aspectRatio: '3/4' },
    { id: 'ro-4', url: 'https://i.pinimg.com/736x/46/5f/da/465fda72748cefa82b432be00d7e860c.jpg', hint: 'kitchen window', type: 'image', aspectRatio: '3/4' },
  ],
  hotel: [
    { id: 'ho-1', url: 'https://vid.alarabiya.net/images/2017/11/12/243ca2ec-850c-4f55-a748-42f17f9432c6/243ca2ec-850c-4f55-a748-42f17f9432c6.jpg', hint: 'hotel curtain', type: 'image', aspectRatio: '16/9' },
    { id: 'ho-2', url: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80', hint: 'hotel room', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-3', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', hint: 'luxury hotel', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-4', url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', hint: 'blackout curtain', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-5', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', hint: 'resort window', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-6', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80', hint: 'suite interior', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-7', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', hint: 'hotel bed', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-8', url: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80', hint: 'vacation room', type: 'image', aspectRatio: '4/3' },
    { id: 'ho-9', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', hint: 'modern hotel', type: 'image', aspectRatio: '4/3' },
  ],
  modern: [
    { id: 'mo-1', url: 'https://lh3.googleusercontent.com/-44vT6hr1IoE/YWF2P99ijTI/AAAAAAAAAj4/IWmmSqN_-xQ5TA41k9tnOzqKrubmson6QCLcBGAsYHQ/s16000/IMG_%C3%99%C2%A2%C3%99%C2%A0%C3%99%C2%A2%C3%99%C2%A1%C3%99%C2%A1%C3%99%C2%A0%C3%99%C2%A0%C3%99%C2%A6_%C3%99%C2%A2%C3%99%C2%A1%C3%99%C2%A3%C3%99%C2%A3%C3%99%C2%A5%C3%99%C2%A6%5B2%5D.webp', hint: 'modern curtain', type: 'image', aspectRatio: '3/4' },
    { id: 'mo-2', url: 'https://mannzely.com/wp-content/uploads/2024/09/%D8%B3%D8%AA%D8%A7%D8%A6%D8%B1-%D8%B7%D8%A8%D9%82%D8%AA%D9%8A%D9%86.webp', hint: 'layered curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-3', url: 'https://blogger.googleusercontent.com/img/a/AVvXsEhQXLirSHRU5jMITbit0kkqTab_sHXa4mNSASDNz5xTGUBiAZvBcPoi0XOKo89WRGQsTxWvxr-N6TMc87yLkIqTIxB-2ZjQKKnLjr4fjaZ-b6SRSHJ_B9EoOxVOiipGgt6YMunrm2dtdfiVtU4Rp0PmadNedhJsTdaolWbZyeHxcDPAVHI0cWeWHw=s16000', hint: 'blue curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-4', url: 'https://www.aldecor.com/wp-content/uploads/2018/07/Curtains-30.jpg', hint: 'living room', type: 'image', aspectRatio: '3/4' },
    { id: 'mo-5', url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiD0imaePrM_eC3rMu8ulY9TRMPntV3OXYPkUgPvw87svz1wIGzvxWs4TOeTjgs_EfQ4hQakYUBfA6KQ1Wx2zylvmZTxfvRknsYi5RBerxRpyVk-3CCHPX5nei7TF_I1xdKWOP5d5j8CgRGtwaz3c4Kw74mClboatnNWcasy86vwYQGF16zlF5a80PaXXkW/w640-h640/%D8%B3%D8%AA%D8%A7%D8%B1%D8%A6%D8%B1%20%D9%85%D9%88%D8%AF%D8%B1%D9%86%20%D9%84%D8%B9%D8%A7%D9%85%202024%20(31).jpg', hint: 'patterned curtain', type: 'image', aspectRatio: '1/1' },
    { id: 'mo-6', url: 'https://img.youm7.com/ArticleImgs/2017/8/9/88518-%D8%B3%D8%AA%D8%A7%D8%A6%D8%B1-%D9%85%D9%88%D8%AF%D8%B1%D9%86.jpg', hint: 'contemporary curtain', type: 'image', aspectRatio: '4/3' },
  ],
  videos: [
      { id: 'vi-1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', hint: 'curtain installation', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', hint: 'fabric types', type: 'video', aspectRatio: '16/9' },
      { id: 'vi-3', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', hint: 'motorized curtain', type: 'video', aspectRatio: '16/9' },
  ]
};
