import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "VEY LORA — Discover. Try. Subscribe.",
  description: "Explore, test, and experience the world's most innovative AI tools — all in one place.",
  openGraph: { title: "VEY LORA", description: "Discover. Try. Subscribe.", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className="min-h-screen bg-navy-950 text-slate-100">
      <Navbar /><main>{children}</main><Footer />
    </body></html>
  );
}
