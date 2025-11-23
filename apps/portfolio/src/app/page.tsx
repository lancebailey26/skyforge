'use client';
import { Input } from "@skyforge/ui";
import { Card } from "@skyforge/ui";
import { useTitle } from "../hooks/useTitle";
import { Tag } from "@skyforge/ui";
import { faUser } from "@fortawesome/free-solid-svg-icons";
export default function HomePage() {
  useTitle("CHAOS");
  
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
        <Input type="text" label="Enter your name"/>
        <Card description="Card Description" subject="Card Subject" />
        <Tag icon={faUser} text="User" onClick={() => {}} removable onRemove={() => {}} />
        </div>
    </main>
  );
}