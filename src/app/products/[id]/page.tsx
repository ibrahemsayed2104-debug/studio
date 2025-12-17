'use server';

import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data';
import { ProductDetails } from '@/components/product-details';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
