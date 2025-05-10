"use client";

import React from "react";
import { Providers } from "@/app/providers";
import TopLoader from "@/components/common/TopLoader";
import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";
import Navbar from "@/components/common/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopLoader />
      <Providers>
        <SmoothScrollProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-4 overflow-hidden">{children}</main>
          </div>
        </SmoothScrollProvider>
      </Providers>
    </>
  );
}
