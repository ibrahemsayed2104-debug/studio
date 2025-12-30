import { Cairo } from 'next/font/google';

export const cairoFont = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-sans',
  weight: ['400', '700', '900'],
});

// We can define both body and headline to use the same font but different variables
// if we want to apply different styles (e.g. weight) easily in tailwind.config
export const bodyFont = cairoFont;
export const headlineFont = cairoFont;
