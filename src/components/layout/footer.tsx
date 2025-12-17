import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { CurtainIcon } from '@/components/icons';
import { siteConfig } from '@/lib/config';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3 7.1 0 .7-.3 1.4-.7 1.9s-1.1.8-1.8.7c-3.6-.3-6.5-1.5-9.3-3.1s-4.7-3.9-6.3-6.2c-1.9-2.8-2.5-5.8-2-8.7 1.5.3 3.1.3 4.6.1.3-2.6 1-5.2 2.6-7.1.6-.7 1.3-1.2 2.1-1.5s1.7-.3 2.5.1c.8.4 1.4.1 2 .6.5.5.8 1.1.9 1.8.2 3.1-.9 6.2-3.1 8.6-2.2 2.4-5.1 4-8.3 4.6" /></svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 text-secondary-foreground border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <CurtainIcon className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold tracking-wider uppercase">روابط سريعة</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link href="/virtual-mockup" className="text-sm hover:text-primary transition-colors">جرّبها في منزلك</Link></li>
              <li><Link href="/orders" className="text-sm hover:text-primary transition-colors">طلباتي</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold tracking-wider uppercase">تواصل معنا</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <a href={siteConfig.contact.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="ms-3 text-sm hover:text-primary transition-colors">{siteConfig.contact.address}</a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="ms-3 text-sm hover:text-primary transition-colors">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <a href={`mailto:${siteConfig.contact.email}`} className="ms-3 text-sm hover:text-primary transition-colors">{siteConfig.contact.email}</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold tracking-wider uppercase">تابعنا</h3>
            <div className="flex mt-4 space-x-4 rtl:space-x-reverse">
              <Link href={siteConfig.social.facebook} className="text-muted-foreground hover:text-primary transition-colors"><FacebookIcon className="h-6 w-6" /></Link>
              <Link href={siteConfig.social.instagram} className="text-muted-foreground hover:text-primary transition-colors"><InstagramIcon className="h-6 w-6" /></Link>
              <Link href={siteConfig.social.twitter} className="text-muted-foreground hover:text-primary transition-colors"><TwitterIcon className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {siteConfig.name}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
