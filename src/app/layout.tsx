import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import Shell from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "Identity Archive",
  description: "A living archive, not a feed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <Shell>{children}</Shell>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

