import type { ReactNode } from "react";
import "@skyforge/ui/theme/tokens.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}