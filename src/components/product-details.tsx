'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { fabrics, SIZES, COLORS, STYLES } from '@/lib/data';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState(fabrics[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const customization = {
      fabric: selectedFabric,
      size: selectedSize,
      color: selectedColor,
      style: selectedStyle,
    };
    addToCart(product, quantity, customization);
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تمت إضافة ${quantity} من ${product.name} إلى سلة التسوق.`,
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="w-full">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg border">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              data-ai-hint={product.imageHint}
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
            {product.name}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">{product.description}</p>
          
          <Separator className="my-8" />

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-headline font-semibold mb-4">تخصيص الستارة</h3>
               <p className="mb-4 text-sm text-muted-foreground">لطلب هذا المنتج، يرجى تخصيصه وإضافته إلى السلة.</p>
              <div className="space-y-6">
                <CustomizationSection title="نوع القماش" items={fabrics} selected={selectedFabric} onSelect={setSelectedFabric} />
                <CustomizationSection title="المقاس" items={SIZES} selected={selectedSize} onSelect={setSelectedSize} />
                <CustomizationSection title="اللون" items={COLORS} selected={selectedColor} onSelect={setSelectedColor} />
                <CustomizationSection title="الستايل" items={STYLES} selected={selectedStyle} onSelect={setSelectedStyle} />
              </div>
            </div>

            <Separator />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}><span className="text-xl">-</span></Button>
                <Input type="number" value={quantity} readOnly className="h-10 w-16 text-center text-lg font-bold" />
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}><span className="text-xl">+</span></Button>
              </div>
              <Button size="lg" className="flex-1 font-bold" onClick={handleAddToCart}>
                <ShoppingCart className="ms-2 h-5 w-5" />
                أضف إلى السلة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CustomizationSectionProps {
    title: string;
    items: string[];
    selected: string;
    onSelect: (value: string) => void;
}

function CustomizationSection({ title, items, selected, onSelect }: CustomizationSectionProps) {
    return (
        <div>
            <h4 className="font-semibold mb-2">{title}</h4>
            <RadioGroup value={selected} onValueChange={onSelect} className="flex flex-wrap gap-2">
                {items.map(item => (
                    <div key={item}>
                        <RadioGroupItem value={item} id={`${title}-${item}`} className="sr-only" />
                        <Label
                            htmlFor={`${title}-${item}`}
                            className={`px-4 py-2 border rounded-full cursor-pointer transition-colors ${
                            selected === item
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-transparent hover:bg-muted'
                            }`}
                        >
                            {item}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}
