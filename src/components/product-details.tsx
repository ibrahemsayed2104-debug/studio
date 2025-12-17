'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { fabrics, SIZES, COLORS, STYLES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [fabric, setFabric] = useState(fabrics[0]);
  const [size, setSize] = useState(SIZES[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity, { fabric, size, color, style });
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

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
            {product.name}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">{product.description}</p>
          
          <p className="mt-6 text-lg text-primary">لطلب هذا المنتج، يرجى تخصيصه وإضافته إلى السلة.</p>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-xl font-headline font-semibold">تخصيص الستارة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fabric */}
              <div className="space-y-2">
                <label className="text-sm font-medium">القماش</label>
                <Select value={fabric} onValueChange={setFabric}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fabrics.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium">المقاس</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium">اللون</label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Style */}
              <div className="space-y-2">
                <label className="text-sm font-medium">الستايل</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <Button size="lg" onClick={handleAddToCart} className="flex-1 font-bold">
              <ShoppingCart className="ms-2 h-5 w-5" />
              إضافة إلى السلة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
