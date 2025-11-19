import type { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          backgroundColor: "#0b0b10",
          color: "#f9fafb"
        }}
      >
        {children}
      </body>
    </html>
  )
}
