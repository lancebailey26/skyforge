import type { ReactNode } from "react";
import "@lancebailey26/skyforge-ui/theme/tokens.css";
import "reactflow/dist/style.css";
import "./portfolio-theme.css";
import { Header, FloatingActionLink } from "@lancebailey26/skyforge-ui";
import { ThemeProvider } from "next-themes";
import { HeaderActions } from "../components/HeaderActions";
import { HashSectionScroll } from "../components/HashSectionScroll";

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
          <HashSectionScroll />
          <main style={{ minHeight: "100vh" }}>
            <Header
              navigation={{
                items: [
                  { label: "About", href: "/#about" },
                  { label: "Stack", href: "/#tech-stack" },
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
        </ThemeProvider>
      </body>
    </html>
  );
}