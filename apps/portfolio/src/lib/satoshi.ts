import localFont from 'next/font/local';

/** Satoshi variable — portfolio UI + display (see src/app/fonts/LICENSE-FFL.txt) */
export const satoshi = localFont({
  src: [
    {
      path: '../app/fonts/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../app/fonts/Satoshi-VariableItalic.woff2',
      weight: '300 900',
      style: 'italic',
    },
  ],
  variable: '--font-portfolio-sans',
  display: 'swap',
});
