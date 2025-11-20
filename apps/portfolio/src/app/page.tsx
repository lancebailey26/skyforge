'use client';
import { Button, Input } from "@skyforge/ui";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Welcome to Skyforge</h1>
        <Button text="Toggle Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}/>
        <Button text="Danger" color="primary" size="small" onClick={() => alert("Hello From Skyforge, Welcome to Dev.")} icon={faUser}/>
        <Input type="text" label="Enter your name"/>
      </div>
    </main>
  );
}