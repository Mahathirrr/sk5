import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skillopa - Platform Pembelajaran Online",
  description: "Belajar skill baru dari instruktur terbaik",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={dmSans.className}>
        <div className="relative min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4">{children}</main>
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
