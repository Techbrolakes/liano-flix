"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link href="/" className="flex items-center gap-1 font-bold">
      <span
        className={`${sizeClasses[size]} bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent`}
      >
        Liano
      </span>
      <span className={`${sizeClasses[size]} text-white`}>Flix</span>
    </Link>
  );
}
