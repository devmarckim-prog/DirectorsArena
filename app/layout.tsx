import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Directors Arena | Cinematic Narrative Engine",
  description: "Experience the Void. Architect your vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-brand-gold/30 selection:text-white`}>
        {/* Unified Cinematic Void Background */}
        <div className="fixed inset-0 bg-neutral-950 bg-[radial-gradient(circle_at_50%_0%,_#1A1A1A_0%,_#050505_100%)] -z-50" />

        {/* Global Fixed Branding */}
        <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-10 z-[100] pointer-events-none">
          <div className="flex items-center space-x-6 pointer-events-auto cursor-pointer">
            <div className="w-10 h-[1px] bg-white/10" />
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Engine: 1.0.4-VOID</span>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <Image 
              src="/logo-full-transparent.png" 
              alt="Directors Arena Logo" 
              width={160} 
              height={40} 
              className="drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]"
            />
          </div>

          <div className="flex items-center space-x-6 pointer-events-auto">
            <div className="flex items-center space-x-3 px-5 py-2 bg-brand-gold/5 border border-brand-gold/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">1,200 Credits</span>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
