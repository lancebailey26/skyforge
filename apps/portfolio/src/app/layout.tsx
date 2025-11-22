import type { ReactNode } from "react";
import "@skyforge/ui/theme/tokens.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}