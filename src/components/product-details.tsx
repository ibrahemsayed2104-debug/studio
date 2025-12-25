'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {

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

          <div className="space-y-4">
            <h3 className="text-xl font-headline font-semibold">معلومات المنتج</h3>
            <p className="text-muted-foreground">
              هذا المنتج متوفر للعرض في معرضنا. للحصول على تفاصيل حول التخصيص والأسعار، يرجى زيارة أحد فروعنا أو التواصل معنا مباشرة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
