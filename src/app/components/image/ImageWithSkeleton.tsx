"use client";

import Image from "next/image";
import clsx from "clsx";
import { useImageDimensions } from "../../hooks/useImageDimensions";

export default function ImageWithSkeleton({
  classname,
  src,
  alt,
}: {
  classname?: string;
  src: string;
  alt: string;
}) {
  const { aspectRatio, isLoading, error } = useImageDimensions(src);

  return (
    <div className={clsx("relative w-full", classname)} style={{ aspectRatio }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded z-10" />
      )}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
      {!error && (
        <Image
          className={clsx(
            "object-cover transition-opacity duration-500 h-[200px] w-[200px]",
            {
              "opacity-0": isLoading,
              "opacity-100": !isLoading,
            }
          )}
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          priority
        />
      )}
    </div>
  );
}
