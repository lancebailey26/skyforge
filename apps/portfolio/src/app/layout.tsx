import type { ReactNode } from "react";
import "@skyforge/ui/theme/tokens.css";
import "reactflow/dist/style.css";
import "./portfolio-theme.css";
import { Header } from "@skyforge/ui";
import { ThemeProvider } from "next-themes";
import { HeaderActions } from "../components/HeaderActions";
import { ScrollToTop } from "../components/ScrollToTop";
import { SkyforgeDensity } from "../components/SkyforgeDensity";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Skyforge Portfolio</title>
      </head>
      <body className="ui-transition">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SkyforgeDensity />
          <Header
            title="Skyforge"
            navigation={{
              items: [
                { label: "About", href: "/about" },
                { label: "Projects", href: "/projects" },
                { label: "Labs", href: "/labs" },
                { label: "Contact", href: "/contact" },
              ],
            }}
            actions={<HeaderActions />}
          />
          <ScrollToTop />
          <main style={{
            minHeight: "100vh",
            backgroundImage: "var(--portfolio-bg-image)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed"
          }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}