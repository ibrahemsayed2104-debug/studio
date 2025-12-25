'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';

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

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-headline font-semibold mb-3">تفاصيل القماش</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.fabricDetails}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-headline font-semibold mb-4">مميزات المنتج</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

             <div>
              <h3 className="text-xl font-headline font-semibold mb-3">تعليمات العناية</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.careInstructions}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
