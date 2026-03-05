import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Chawa's WildCatcher — Zimbabwe Snake ID & Expert Consultation",
  description:
    "Instant AI-powered snake identification for Zimbabwe's 8 most common species. Book expert consultations and access emergency support.",
  keywords: ["Zimbabwe snakes", "snake identification", "herpetology", "snake bite", "wildlife", "Chawa's Wild Adventures"],
  openGraph: {
    title: "Chawa's WildCatcher",
    description: "Know Your Snake. Save Your Life.",
    siteName: "Chawa's WildCatcher",
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
              background: "#0D1F10",
              color: "#F0FDF4",
              border: "1px solid rgba(34,197,94,0.2)",
            },
          }}
        />
      </body>
    </html>
  );
}
