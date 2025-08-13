import React from "react";
import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  imageSrc,
  imageAlt,
}: HeroProps) {
  return (
    <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center text-center md:text-left overflow-hidden bg-background gap-10 md:gap-20">
      {/* Hero Text */}
      <div className="flex-1 flex flex-col items-center md:items-start justify-center z-10 gap-4 md:flex-3/5 lg:flex-1">
        <h1 className="text-primary text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mb-10 text-balance text-secondary">
          {subtitle}
        </p>
        <a
          href={ctaHref}
          className="inline-block px-10 py-4 rounded-full font-semibold text-lg bg-accent hover:bg-accent-hover text-white hover:text-black transition-all duration-300 ease-in-out md:text-xl focus:outline-none focus:ring-4 focus:ring-[var(--jp-color-accent)]/40"
        >
          {ctaText}
        </a>
      </div>

      {/* Hero Image with framer-motion animation */}
      {imageSrc && (
        <div className="flex-1 flex items-center justify-center group md:flex-2/5 lg:flex-none">
          <Image
            src={imageSrc}
            alt={imageAlt || "please provide an alt text for this image"}
            width={1000}
            height={1000}
            className="object-cover h-full w-full md:h-5/6 md:w-auto border-4 border-primary/80 transition-transform duration-500"
            quality={100}
            priority
          />
        </div>
      )}
    </div>
  );
}
