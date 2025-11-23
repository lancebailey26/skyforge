import type { ReactNode } from "react";
import "@skyforge/ui/theme/tokens.css";
import { Header } from "@skyforge/ui";
import { ThemeProvider } from "next-themes";
import { HeaderActions } from "../components/HeaderActions";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Skyforge Portfolio</title>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header
            title="Skyforge"
            navigation={{
              items: [
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Projects", href: "/projects" },
                { label: "Contact", href: "/contact" },
              ],
            }}
            actions={<HeaderActions />}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}