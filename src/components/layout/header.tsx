'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, GalleryVertical, Home, Wand2, ChevronDown, Package, Phone, MapPin, ShieldCheck, User, Truck } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { CurtainIcon } from '@/components/icons';
import { CartView } from '@/components/cart-view';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/gallery', label: 'المعرض', icon: GalleryVertical },
  { href: '/design-assistant', label: 'مساعد التصميم', icon: Wand2 },
];

const customerLinks = [
    { href: '/orders', label: 'تتبع طلبك', icon: Truck },
    { href: '/contact', label: 'تواصل معنا', icon: Phone },
]

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  // The Admin link is now hardcoded to point to the dashboard page.
  // It will be conditionally rendered based on the NEXT_PUBLIC_APP_MODE.
  const isAdminMode = process.env.NEXT_PUBLIC_APP_MODE === 'ADMIN';

  const allMobileLinks = [
      ...navLinks,
      ...customerLinks,
      { href: siteConfig.contact.googleMapsUrl, label: 'الموقع', icon: MapPin, external: true },
      ...(isAdminMode ? [{ href: '/admin/dashboard', label: 'إدارة الطلبات', icon: ShieldCheck, admin: true }] : []),
  ]

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
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-foreground/80 hover:text-primary">
                        <User className="ms-2 h-4 w-4" />
                        خدمة العملاء
                        <ChevronDown className="me-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {customerLinks.map(link => (
                         <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href}>
                                <link.icon className="ms-2 h-4 w-4" />
                                {link.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                     <DropdownMenuItem asChild>
                        <Link href={siteConfig.contact.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <MapPin className="ms-2 h-4 w-4" />
                            الموقع
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {isAdminMode && (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-foreground/80 hover:text-primary">
                          <ShieldCheck className="ms-2 h-4 w-4" />
                          لوحة التحكم
                          <ChevronDown className="me-2 h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard">
                              <Package className="ms-2 h-4 w-4" />
                              إدارة الطلبات
                          </Link>
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
          
          <div className="flex items-center gap-2">
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
                 <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
                <CartView />
              </SheetContent>
            </Sheet>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                 <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <div className="flex flex-col gap-6 pt-10">
                  <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse" onClick={handleMobileLinkClick}>
                    <CurtainIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-2xl">{siteConfig.name}</span>
                  </Link>
                  {allMobileLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      onClick={handleMobileLinkClick}
                      className={cn(
                        'text-lg transition-colors hover:text-foreground/80 flex items-center gap-3',
                        (pathname === link.href || (link.admin && pathname.startsWith('/admin'))) ? 'text-primary font-semibold' : 'text-foreground/60'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
