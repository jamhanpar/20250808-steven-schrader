"use client";

import type React from "react";

import { useEffect, useState } from "react";

export function useScrollProgress(elementRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate how much of the element has been scrolled through
      const scrolled = Math.max(0, viewportHeight - rect.top);
      const maxScroll = elementHeight + viewportHeight;
      const scrollProgress = Math.min(1, Math.max(0, scrolled / maxScroll));

      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [elementRef]);

  return progress;
}
