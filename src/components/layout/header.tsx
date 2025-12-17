'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, GalleryVertical, Home, Package, Smartphone, Users, Phone, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CurtainIcon } from '@/components/icons';
import { CartView } from '@/components/cart-view';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config';
import { AuthButton } from '../auth-button';

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/gallery', label: 'المعرض', icon: GalleryVertical },
  { href: '/virtual-mockup', label: 'جرّبها في منزلك', icon: Smartphone },
  { href: '/orders', label: 'طلباتي', icon: Package },
  { href: '/contact', label: 'تواصل معنا', icon: Phone },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex-1 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <CurtainIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-2xl">{siteConfig.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild className={cn(
                  'transition-colors',
                  pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary'
              )}>
                <Link
                  href={link.href}
                >
                  <link.icon className="ms-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
             <Button variant="ghost" asChild className="text-foreground/80 hover:text-primary">
              <Link href={siteConfig.contact.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="ms-2 h-4 w-4" />
                الموقع
              </Link>
            </Button>
          </nav>
          
          <div className="flex items-center gap-2">
            <AuthButton />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{itemCount}</Badge>
                  )}
                  <span className="sr-only">Open shopping cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] p-0">
                <CartView />
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 pt-10">
                  <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CurtainIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-2xl">{siteConfig.name}</span>
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-lg transition-colors hover:text-foreground/80 flex items-center gap-3',
                        pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/60'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                  <Link
                      href={siteConfig.contact.googleMapsUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='text-lg text-foreground/60 transition-colors hover:text-foreground/80 flex items-center gap-3'
                    >
                      <MapPin className="h-5 w-5" />
                      الموقع
                    </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
