import { useState, useEffect } from "react";

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  isLoading: boolean;
  error: boolean;
}

export function useImageDimensions(src: string): ImageDimensions {
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 16 / 9, // Default fallback
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    if (!src) {
      setDimensions((prev) => ({ ...prev, isLoading: false, error: true }));
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio,
        isLoading: false,
        error: false,
      });
    };

    img.onerror = () => {
      setDimensions((prev) => ({
        ...prev,
        isLoading: false,
        error: true,
      }));
    };

    img.src = src;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return dimensions;
}
