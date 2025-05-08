import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { Providers } from "@/app/providers";
import TopLoader from "@/app/components/TopLoader";
import SmoothScrollProvider from "@/app/components/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LianoFlix | Stream Movies & TV Shows",
  description:
    "Watch your favorite movies and TV shows on LianoFlix - a Netflix-inspired streaming service",
  keywords: [
    "movies",
    "streaming",
    "netflix",
    "lianoflix",
    "tv shows",
    "watch online",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen`}
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
