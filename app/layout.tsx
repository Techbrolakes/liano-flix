"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import TopLoader from "@/components/common/TopLoader";
import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";
import { satoshi } from "./fonts";
import Navbar from "@/components/common/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} antialiased bg-background min-h-screen font-sans`}
      >
        <TopLoader />
        <Providers>
          <SmoothScrollProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-16 overflow-hidden">{children}</main>
            </div>
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
