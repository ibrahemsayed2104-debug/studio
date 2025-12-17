import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="relative w-full aspect-[4/3] bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.imageHint}
          />
        </div>
        <div className="p-4">
          <h3 className="font-headline font-semibold text-lg truncate text-foreground">{product.name}</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            عرض التفاصيل
          </p>
        </div>
      </Card>
    </Link>
  );
}
