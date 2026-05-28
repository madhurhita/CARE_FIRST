import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CareFirst Health | Patient Portal",
  description: "Book your appointment and get AI personalized pre-visit instructions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
