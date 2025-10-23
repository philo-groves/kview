import { Cousine, Montserrat } from "next/font/google";

export const brand_font = Cousine({ // used for logo and several numeric statistics
  subsets: ['latin'],
  weight: ['400', '700']
});

export const global_font = Montserrat({ // used for most text
  subsets: ['latin'],
  weight: ['400', '700']
});
