'use client';
import { Button, Input } from "@skyforge/ui";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Card } from "@skyforge/ui";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
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
          <div style={{ display: "flex", gap: "1rem" }}>
          <Card 
            // title="Card Title" 
            mode="popup" 
            size="xlarge" 
            tagline="Card Tagline" 
            description="Card Description" 
            subject={{ 
              src: "https://www.starnewsonline.com/gcdn/authoring/2013/06/19/NSTN/ghows-NC-6d0e280e-bfec-4826-9efc-430f1ecdc18e-bf520249.jpeg?width=605&height=454&fit=crop&format=pjpg&auto=webp", 
              alt: "James Gandolfini" 
            }} 
            headerControls={[{icon: faXmark, onClick: () => alert("Hello From Skyforge, Welcome to Dev."), ariaLabel: "Close"}]}
          />
        <Card mode="inlaid" size="large" tagline="Card Title" description="Card Description" subject="Card Subject" />
        </div>
        </div>
    </main>
  );
}