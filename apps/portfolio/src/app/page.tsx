import { Button } from "@skyforge/ui"

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Welcome to Skyforge</h1>
        <p style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
        </p>
        <Button>Danger</Button>
      </div>
    </main>
  )
}
