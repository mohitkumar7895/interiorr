import React from "react";
import Link from "next/link";
import Image from "next/image";

interface MaLogoProps {
  variant?: "full" | "horizontal" | "emblem";
  className?: string;
  height?: number;
}

export default function MaLogo({
  variant = "horizontal",
  className = "",
  height = 50,
}: MaLogoProps) {
  if (variant === "emblem") {
    return (
      <Link href="/" className={`inline-flex items-center group ${className}`}>
        <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/logo/ma-emblem.svg"
            alt="MA Carpenter and Interior Logo"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </div>
      </Link>
    );
  }

  if (variant === "full") {
    return (
      <Link href="/" className={`inline-block group text-center ${className}`}>
        <div className="relative w-56 h-36 mx-auto transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/logo/ma-logo.svg"
            alt="MA Carpenter and Interior Logo"
            fill
            sizes="224px"
            className="object-contain"
            priority
          />
        </div>
      </Link>
    );
  }

  // Horizontal variant (default for Navbar)
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* 3D Gold Emblem */}
      <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo/ma-emblem.svg"
          alt="MA Logo"
          fill
          sizes="48px"
          className="object-contain"
          priority
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-black tracking-widest text-lg md:text-xl gold-text-gradient drop-shadow-sm">
            MA
          </span>
          <span className="font-serif font-bold tracking-wider text-xs md:text-sm text-brand-creamSoft">
            CARPENTER & INTERIOR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
            Carpenter and Interior
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
          <span className="hidden sm:inline-block text-[9px] text-gray-400 italic">
            Sector 120 Noida
          </span>
        </div>
      </div>
    </Link>
  );
}

