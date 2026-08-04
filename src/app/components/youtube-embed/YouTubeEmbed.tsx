"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full h-full group cursor-pointer"
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />
      {/* Play button — frosted glass */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.3)] group-hover:bg-white/25 group-hover:scale-110 group-hover:shadow-[0_4px_32px_rgba(0,0,0,0.4),0_0_0_5px_rgba(255,255,255,0.12)] transition-all duration-300 ease-out">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current text-white ml-1"
            aria-hidden
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
    </button>
  );
}
