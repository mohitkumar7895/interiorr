"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/placeholder.svg";

export default function SafeImage({
  src,
  alt = "MA Carpenter and Interior",
  fallbackSrc = DEFAULT_FALLBACK,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...rest
}: SafeImageProps) {
  const initialSrc = (src && typeof src === "string" && src.trim().length > 0)
    ? src.trim()
    : fallbackSrc;

  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state if src changes
  useEffect(() => {
    if (src && typeof src === "string" && src.trim().length > 0) {
      setImgSrc(src.trim());
      setHasError(false);
      setIsLoading(true);
    } else {
      setImgSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  return (
    <div className={`relative overflow-hidden ${rest.fill ? "w-full h-full" : "inline-block"}`}>
      {/* Background loading shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-brand-charcoal/70 animate-pulse pointer-events-none z-0" />
      )}

      <Image
        {...rest}
        src={imgSrc}
        alt={alt || "MA Carpenter and Interior"}
        sizes={sizes}
        className={`${className} ${isLoading ? "opacity-70" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError && imgSrc !== fallbackSrc) {
            setHasError(true);
            setImgSrc(fallbackSrc);
          }
          setIsLoading(false);
        }}
      />
    </div>
  );
}

