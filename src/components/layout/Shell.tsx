import { ReactNode } from "react";
import Navbar from "./Navbar";

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <footer className="py-12 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Identity Archive © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}

