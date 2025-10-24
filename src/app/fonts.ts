import { Source_Code_Pro, Montserrat } from "next/font/google";

export const brand_font = Source_Code_Pro({ // used for logo and several numeric statistics
  weight:'400',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false
});

export const global_font = Montserrat({ // used for most text
  subsets: ['latin'],
  weight: ['400', '700']
});
