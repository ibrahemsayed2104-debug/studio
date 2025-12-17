import type { Product, Order } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) return { url: '', hint: '', description: '' };
  return { url: image.imageUrl, hint: image.imageHint, description: image.description };
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ستارة شيفون أنيقة',
    description: 'ستارة شيفون بيج أنيقة تضفي لمسة من الرقي على أي غرفة.',
    imageId: 'curtain-1',
    image: getImage('curtain-1').url,
    imageHint: getImage('curtain-1').hint,
  },
  {
    id: '2',
    name: 'ستارة عنابي فاخرة',
    description: 'ستارة فاخرة من قماش قطيفة باللون العنابي، مثالية لغرف النوم والمعيشة.',
    imageId: 'curtain-2',
    image: getImage('curtain-2').url,
    imageHint: getImage('curtain-2').hint,
  },
  {
    id: '3',
    name: 'ستارة رمادية عصرية',
    description: 'ستارة عصرية بنقوش هندسية باللون الرمادي، تضفي لمسة مودرن.',
    imageId: 'curtain-3',
    image: getImage('curtain-3').url,
    imageHint: getImage('curtain-3').hint,
  },
  {
    id: '4',
    name: 'ستارة كتان بيضاء',
    description: 'ستارة بيضاء من الكتان الطبيعي، تصميم بسيط يناسب جميع الديكورات.',
    imageId: 'curtain-4',
    image: getImage('curtain-4').url,
    imageHint: getImage('curtain-4').hint,
  },
  {
    id: '5',
    name: 'ستارة مخملية كحلية',
    description: 'ستارة مخملية بلون كحلي داكن، لحجب الضوء وإضافة لمسة من الفخامة.',
    imageId: 'curtain-5',
    image: getImage('curtain-5').url,
    imageHint: getImage('curtain-5').hint,
  },
  {
    id: '6',
    name: 'ستارة قطن خضراء',
    description: 'ستارة قطنية بلون أخضر ترابي، تمنح شعورًا بالراحة والهدوء.',
    imageId: 'curtain-6',
    image: getImage('curtain-6').url,
    imageHint: getImage('curtain-6').hint,
  },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: '#3210',
        date: '2024-05-15',
        status: 'Delivered',
        items: [{
            id: 'item-1',
            product: PRODUCTS[1],
            quantity: 1,
            customization: { fabric: 'قطيفة', size: '200x250 سم', color: 'عنابي', style: 'كلاسيك' }
        }]
    },
    {
        id: '#3201',
        date: '2024-06-28',
        status: 'Shipped',
        items: [{
            id: 'item-2',
            product: PRODUCTS[2],
            quantity: 2,
            customization: { fabric: 'قطن', size: '150x250 سم', color: 'رمادي', style: 'مودرن' }
        }]
    },
    {
        id: '#2951',
        date: '2024-07-10',
        status: 'Processing',
        items: [{
            id: 'item-3',
            product: PRODUCTS[3],
            quantity: 1,
            customization: { fabric: 'كتان', size: '150x250 سم', color: 'أبيض', style: 'بسيط' }
        }]
    }
];

export const fabrics = ['شيفون', 'قطن', 'مخمل', 'كتان', 'قطيفة'];
export const SIZES = ['150x250 سم', '200x250 سم', '300x250 سم', 'حجم مخصص'];
export const COLORS = ['أبيض', 'أوف وايت', 'بيج', 'سكري', 'رمادي فاتح', 'رمادي داكن', 'فحمي', 'أسود', 'كحلي', 'أزرق سماوي', 'أخضر زيتوني', 'أخضر نعناعي', 'عنابي', 'أحمر', 'وردي فاتح', 'فوشيا', 'موف', 'أصفر', 'برتقالي', 'بني', 'ذهبي', 'فضي'];
export const STYLES = ['كلاسيك', 'مودرن', 'بسيط', 'روماني'];
