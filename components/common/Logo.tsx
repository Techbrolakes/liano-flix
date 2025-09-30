"use client";

import Link from "next/link";
import Image from "next/image";

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
    <Link
      href="/"
      className="group flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
    >
      {/* Logo Icon */}
      <div className="relative">
        <Image
          src="/favicon.svg"
          alt="OlaMax Logo"
          width={size === "sm" ? 32 : size === "lg" ? 44 : 36}
          height={size === "sm" ? 32 : size === "lg" ? 44 : 36}
          className="transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
          priority
        />
      </div>

      {/* Logo Text */}
      <div className="flex items-center">
        <span
          className={`
          ${sizeClasses[size]} 
          font-black tracking-tight
          bg-gradient-to-r from-white via-pink-200 to-pink-400
          bg-clip-text text-transparent
          drop-shadow-sm
        `}
        >
          Ola
        </span>
        <span
          className={`
          ${sizeClasses[size]} 
          font-black tracking-tight
          bg-gradient-to-r from-pink-400 via-purple-500 to-violet-600
          bg-clip-text text-transparent
          drop-shadow-sm
        `}
        >
          max
        </span>
      </div>

      {/* Subtle accent dot */}
      <div
        className={`
        ${
          size === "sm"
            ? "w-1.5 h-1.5"
            : size === "lg"
            ? "w-2 h-2"
            : "w-1.5 h-1.5"
        }
        rounded-full bg-gradient-to-br from-pink-400 to-purple-600
        group-hover:scale-150 transition-transform duration-300
        shadow-sm shadow-purple-500/50
      `}
      ></div>
    </Link>
  );
}
