"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { X, ShoppingCart } from 'lucide-react';

export function CartView() {
  const { cartItems, removeFromCart, updateQuantity, itemCount } = useCart();

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="p-6">
        <SheetTitle className="text-lg font-medium text-foreground">سلة التسوق ({itemCount})</SheetTitle>
        <SheetDescription>
          المنتجات الموجودة في سلتك.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">{item.customization.fabric}, {item.customization.size}</p>
                    <p className="text-sm text-muted-foreground">{item.customization.color}, {item.customization.style}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><span className="text-lg">-</span></Button>
                        <Input type="number" value={item.quantity} readOnly className="h-8 w-12 text-center" />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><span className="text-lg">+</span></Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => removeFromCart(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="p-6 bg-secondary/50 border-t">
            <div className="w-full space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>إجمالي المنتجات:</span>
                <span>{itemCount}</span>
              </div>
              <Button asChild size="lg" className="w-full font-bold">
                <Link href="/cart">إتمام الطلب</Link>
              </Button>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-20 w-20 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-headline font-semibold">سلتك فارغة</h3>
            <p className="mt-2 text-muted-foreground">يبدو أنك لم تقم بإضافة أي منتجات بعد.</p>
            <Button asChild className="mt-6">
                <Link href="/">ابدأ التسوق</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
