import React from "react";
import clsx from "clsx";
import Image from "next/image";

interface HeroProps {
  title: string[];
  subtitle: string;
  ctas: { label: string; url: string }[];
  ctaText: string;
  ctaHref: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function Hero({
  title,
  subtitle,
  ctas,
  imageSrc,
  imageAlt,
}: HeroProps) {
  return (
    <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center text-center md:text-left overflow-hidden bg-background gap-10 md:gap-12">
      {/*--- Hero Text ---*/}
      <div className="flex flex-col items-center md:items-start justify-center z-10 gap-4 md:flex-2/6">
        <div>
          {title.map((line, index) => (
            <h1
              className={clsx(
                "text-primary text-2xl font-extrabold mb-6 tracking-tight md:leading-none",
                {
                  "md:text-4xl": index !== title.length - 1,
                  "font-thin italic": index === title.length - 1,
                }
              )}
              key={index}
            >
              {line}
              {index < title.length - 1 && <br />}
            </h1>
          ))}
        </div>
        <div className="w-full text-base md:text-xl mb-10 text-balance text-primary">
          {subtitle.split("\n\n").map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
        {ctas.length > 0 && (
          <div className="w-full flex flex-col md:flex-row md:justify-start gap-3 pl-1">
            {ctas.map((cta, index) => (
              <a
                key={index}
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-fit text-center text-base flex items-center justify-center p-4 md:px-6 md:py-2 bg-gradient-to-br from-accent to-accent-hover text-white font-medium rounded-full transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 hover:cursor-pointer"
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Hero Image with framer-motion animation */}
      {imageSrc && (
        <div className="flex-1 flex items-center justify-center group">
          <Image
            src={imageSrc}
            alt={imageAlt || "please provide an alt text for this image"}
            width={1000}
            height={1000}
            className="rounded-xl object-cover h-96 md:h-full w-full border-primary/80 transition-transform duration-500"
            quality={100}
            priority
          />
        </div>
      )}
    </div>
  );
}
