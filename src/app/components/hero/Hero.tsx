import React from "react";
import heroContent from "./heroContent.json";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-center text-center md:text-left overflow-hidden bg-background gap-10 md:gap-20">
      {/* Modern gradient background shapes */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-gradient-to-tr from-[var(--jp-color-primary)]/30 via-[var(--jp-color-accent)]/20 to-[var(--jp-color-secondary)]/30 rounded-full blur-3xl opacity-70 animate-pulse" />
      </div>
      {/* Hero Text */}
      <div className="flex-1 flex flex-col items-center md:items-start justify-center z-10 gap-4">
        <h1
          className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg tracking-tight"
          style={{ color: "var(--jp-color-primary)" }}
        >
          {heroContent.title}
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mb-10 text-balance text-[var(--jp-color-text)]">
          {heroContent.subtitle}
        </p>
        <a
          href={heroContent.ctaHref}
          className="inline-block px-10 py-4 rounded-full font-semibold text-lg md:text-xl shadow-lg bg-[var(--jp-color-primary)] hover:bg-[var(--jp-color-accent)] text-[var(--jp-color-surface)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--jp-color-accent)]/40"
          style={{ boxShadow: "var(--jp-shadow-md)" }}
        >
          {heroContent.ctaText}
        </a>
      </div>
      {/* Hero Image */}
      <div className="flex-1 flex items-center justify-center z-10">
        <Image
          // src="/images/unsplash-angelina-litvin.avif"
          src="/images/author-steve-schrader.jpg"
          alt="Picture of Steven Schrader"
          width={400}
          height={200}
          // className="rounded-2xl shadow-xl object-cover w-full h-auto max-w-xs md:max-w-md lg:max-w-lg"
          className="rounded-2xl shadow-xl object-cover w-full aspect-square"
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
