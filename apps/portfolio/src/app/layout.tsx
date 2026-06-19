import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import "@lancebailey26/skyforge-ui/theme/tokens.css";
import "reactflow/dist/style.css";
import "./portfolio-tokens.css";
import "./portfolio-base.css";
import "./portfolio-sections.css";
import "./portfolio-labs.css";
import "./portfolio-case-studies.css";
import "./portfolio-chrome.css";
import { Header, FloatingActionLink } from "@lancebailey26/skyforge-ui";
import { ThemeProvider } from "next-themes";
import { HeaderActions } from "../components/HeaderActions";
import { HashSectionScroll } from "../components/HashSectionScroll";
import { satoshi } from "../lib/satoshi";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={satoshi.variable} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/assets/favicon.svg" sizes="any" />
        <title>lancebailey - dev</title>
      </head>
      <body className={satoshi.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <HashSectionScroll />
          <main style={{ minHeight: "100vh" }}>
            <Header
              title="LB"
              className="portfolio-site-header"
              navigation={{
                items: [
                  { label: "About", href: "/#about" },
                  { label: "Stack", href: "/#tech-stack" },
                  { label: "Reference", href: "/#reference" },
                  { label: "Projects", href: "/#projects" },
                  { label: "Labs", href: "/#labs" },
                  { label: "Contact", href: "/#contact" },
                ],
              }}
              actions={<HeaderActions />}
            />
            {children}
            <FloatingActionLink
              href="/#contact"
              label="Contact"
              ariaLabel="Go to contact section"
            />
          </main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
