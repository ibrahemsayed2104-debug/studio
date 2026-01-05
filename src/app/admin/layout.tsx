import Link from 'next/link';
import { Home, GalleryVertical, LayoutDashboard } from 'lucide-react';
import { CurtainIcon } from '@/components/icons';
import { siteConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-secondary/70 backdrop-blur">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-2 rtl:space-x-reverse">
            <CurtainIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-2xl">{siteConfig.name} - الإدارة</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
             <Button variant="ghost" asChild>
                <Link href="/admin/dashboard">
                    <LayoutDashboard className="ms-2 h-4 w-4" />
                    لوحة التحكم
                </Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/" target="_blank">
                    <Home className="ms-2 h-4 w-4" />
                    عرض الموقع
                </Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/gallery" target="_blank">
                    <GalleryVertical className="ms-2 h-4 w-4" />
                    المعرض
                </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-muted/20">{children}</main>
    </div>
  );
}
