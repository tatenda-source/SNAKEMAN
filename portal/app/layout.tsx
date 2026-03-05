import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SNAKEMAN Expert Portal",
  description: "Expert dashboard for managing bookings, emergencies, and content.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-text-primary">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: "#161B24", color: "#E2E8F0", border: "1px solid #1E2739" },
          }}
        />
      </body>
    </html>
  );
}
