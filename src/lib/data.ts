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
    name: 'ستائر رول مكتبية',
    description: 'ستائر رول عملية وأنيقة للمكاتب، توفر الخصوصية وتتحكم في الإضاءة.',
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

export const COUNTRIES = ['مصر', 'المملكة العربية السعودية'];

export const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 'الطائف', 'تبوك', 'بريدة', 'أبها', 'خميس مشيط', 'جيزان', 'نجران', 'حائل'
];

export const EGYPT_GOVERNORATES = [
  { governorate: 'القاهرة', cities: ['القاهرة الجديدة', 'التجمع الخامس', 'التجمع الاول', 'مدينة نصر', 'مصر الجديدة', 'المعادي', 'المقطم', 'الهضبة الوسطى', 'منشأة ناصر', 'الزمالك', 'وسط البلد', 'شبرا', 'حلوان', 'العباسية', 'التحرير', 'الرحاب', 'مدينتي', 'الشروق', 'بدر', 'العاصمة الإدارية الجديدة', 'الشيخ زايد'] },
  { governorate: 'الجيزة', cities: ['الجيزة', 'الهرم', 'فيصل', 'أكتوبر', 'المهندسين', 'الدقي', 'إمبابة', 'العجوزة'] },
  { governorate: 'الإسكندرية', cities: ['الإسكندرية', 'سيدي بشر', 'ميامي', 'العجمي', 'المنتزه', 'برج العرب', 'سموحة'] },
  { governorate: 'القليوبية', cities: ['بنها', 'شبرا الخيمة', 'القناطر الخيرية', 'الخانكة', 'العبور', 'قليوب'] },
  { governorate: 'الغربية', cities: ['طنطا', 'المحلة الكبرى', 'كفر الزيات', 'زفتى', 'سمنود'] },
  { governorate: 'المنوفية', cities: ['شبين الكوم', 'السادات', 'منوف', 'أشمون', 'قويسنا'] },
  { governorate: 'الدقهلية', cities: ['المنصورة', 'ميت غمر', 'السنبلاوين', 'بلقاس', 'طلخا'] },
  { governorate: 'الشرقية', cities: ['الزقازيق', 'العاشر من رمضان', 'بلبيس', 'فاقوس', 'منيا القمح'] },
  { governorate: 'البحيرة', cities: ['دمنهور', 'كفر الدوار', 'إيتاي البارود', 'رشيد', 'وادي النطرون'] },
  { governorate: 'كفر الشيخ', cities: ['كفر الشيخ', 'دسوق', 'بيلا', 'فوه', 'بلطيم'] },
  { governorate: 'دمياط', cities: ['دمياط', 'دمياط الجديدة', 'رأس البر', 'فارسكور'] },
  { governorate: 'بورسعيد', cities: ['بورسعيد', 'بورفؤاد'] },
  { governorate: 'الإسماعيلية', cities: ['الإسماعيلية', 'فايد', 'القنطرة'] },
  { governorate: 'السويس', cities: ['السويس', 'العين السخنة'] },
  { governorate: 'شمال سيناء', cities: ['العريش', 'رفح', 'الشيخ زويد', 'بئر العبد'] },
  { governorate: 'جنوب سيناء', cities: ['شرم الشيخ', 'دهب', 'نويبع', 'الطور', 'طابا'] },
  { governorate: 'البحر الأحمر', cities: ['الغردقة', 'سفاجا', 'القصير', 'مرسى علم', 'الجونة'] },
  { governorate: 'الفيوم', cities: ['الفيوم', 'سنورس', 'إطسا', 'طامية'] },
  { governorate: 'بني سويف', cities: ['بني سويف', 'الواسطى', 'ناصر', 'ببا'] },
  { governorate: 'المنيا', cities: ['المنيا', 'ملوي', 'سمالوط', 'بني مزار', 'مغاغة'] },
  { governorate: 'أسيوط', cities: ['أسيوط', 'منفلوط', 'ديروط', 'القوصية', 'أبنوب'] },
  { governorate: 'سوهاج', cities: ['سوهاج', 'جرجا', 'أخميم', 'طما', 'طهطا'] },
  { governorate: 'قنا', cities: ['قنا', 'نجع حمادي', 'قفط', 'دشنا', 'فرشوط'] },
  { governorate: 'الأقصر', cities: ['الأقصر', 'إسنا', 'أرمنت'] },
  { governorate: 'أسوان', cities: ['أسوان', 'كوم أمبو', 'إدفو', 'أبو سمبل'] },
  { governorate: 'الوادي الجديد', cities: ['الخارجة', 'الداخلة', 'الفرافرة'] },
  { governorate: 'مطروح', cities: ['مرسى مطروح', 'العلمين', 'سيوة', 'الحمام'] },
];
