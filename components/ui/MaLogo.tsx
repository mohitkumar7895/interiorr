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
    <Link href="/" className={`inline-flex items-center gap-2 sm:gap-2.5 xl:gap-3 group shrink-0 ${className}`}>
      {/* 3D Gold Emblem */}
      <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-9 lg:h-9 xl:w-11 xl:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
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
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-1 sm:gap-1.5 leading-tight">
          <span className="font-serif font-black tracking-widest text-base sm:text-lg md:text-xl lg:text-base xl:text-lg gold-text-gradient drop-shadow-sm">
            MA
          </span>
          <span className="font-serif font-bold tracking-wider text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm lg:text-xs xl:text-sm text-brand-creamSoft whitespace-nowrap">
            CARPENTER &amp; INTERIOR
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 leading-none mt-0.5">
          <span className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.18em] xl:tracking-[0.22em] text-brand-gold font-semibold whitespace-nowrap">
            Luxury Woodwork &amp; Turnkey
          </span>
          <span className="hidden 2xl:inline-block w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
          <span className="hidden 2xl:inline-block text-[9px] text-gray-400 italic">
            Sector 120 Noida
          </span>
        </div>
      </div>
    </Link>
  );
}

