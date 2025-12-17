import { Literata, Playfair_Display } from 'next/font/google';

export const bodyFont = Literata({
  subsets: ['latin'],
  variable: '--font-body',
});

export const headlineFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
});
