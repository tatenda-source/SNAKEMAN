import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "chawaswildadventures — Zimbabwe Snake ID & Expert Consultation",
  description:
    "Instant AI-powered snake identification for Zimbabwe's 8 most common species. Book expert consultations and access emergency support.",
  keywords: ["Zimbabwe snakes", "snake identification", "herpetology", "snake bite", "wildlife", "chawaswildadventures"],
  openGraph: {
    title: "chawaswildadventures",
    description: "Know Your Snake. Save Your Life.",
    siteName: "chawaswildadventures",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-void text-parchment font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1F1210",
              color: "#FFF5F5",
              border: "1px solid rgba(220,38,38,0.2)",
            },
          }}
        />
      </body>
    </html>
  );
}
