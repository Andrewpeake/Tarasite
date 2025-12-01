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
      <footer className="py-12 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-neutral-500 text-center">
            Identity Archive © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}

