'use client';
import { Button, Notification, Container } from "@skyforge/ui";
import { useTitle } from "../hooks/useTitle";
import Link from "next/link";

export default function HomePage() {
  useTitle("");

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      maxWidth: "800px",
      margin: "0 auto",
      textAlign: "center"
    }}>
      <Notification
        title="Welcome to Skyforge"
        description="You are viewing the development version of my portfolio. Some features may not be available yet, and some may be buggy, because this is in active development."
        type="info"
        timeout={5000}
        placement="top-right"
      />
      <Container size="large" padding="lg" glass={true}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
          <div>
            <h1 style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              marginBottom: "1rem",
              lineHeight: 1.2
            }}>
              Skyforge
            </h1>
            <p style={{
              fontSize: "1.25rem",
              color: "var(--color-on-surface-alt)",
              lineHeight: 1.6,
              marginBottom: "2rem"
            }}>
              Building modern web experiences with clean code and thoughtful design.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            alignItems: "center"
          }}>
            <Link href="/projects" style={{ textDecoration: "none" }}>
              <Button
                text="View Projects"
                size="large"
                color="primary"
                type="link"
              />
            </Link>

            <div style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "1rem"
            }}>
              <Link href="/about" style={{ textDecoration: "none", color: "var(--color-on-surface-alt)" }}>
                About
              </Link>
              <span style={{ color: "var(--color-on-surface-alt)" }}>•</span>
              <Link href="/contact" style={{ textDecoration: "none", color: "var(--color-on-surface-alt)" }}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}