"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { YouTubeEmbed } from "../youtube-embed/YouTubeEmbed";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  caption: string;
  duration?: string;
}

interface MusicVideosProps {
  headline: string;
  description: string;
  watchMoreUrl: string;
  videos: Video[];
}

const BAR_ANIMATIONS = [
  { heights: [13, 6, 13, 10, 13], duration: 1.1 },
  { heights: [18, 8, 18, 14, 18], duration: 0.9 },
  { heights: [15, 7, 15, 11, 15], duration: 1.3 },
];

function EqualizerIcon() {
  const bars = [
    { x: 0, baseHeight: 13, baseY: 5 },
    { x: 9, baseHeight: 18, baseY: 0 },
    { x: 18, baseHeight: 15, baseY: 3 },
  ];

  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
      {bars.map((bar, i) => {
        const anim = BAR_ANIMATIONS[i];
        return (
          <motion.rect
            key={i}
            x={bar.x}
            width="4"
            rx="2"
            fill="currentColor"
            animate={{
              height: anim.heights,
              y: anim.heights.map((h) => 18 - h),
            }}
            transition={{
              duration: anim.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden>
      <path
        d="M1 1.5L9 6L1 10.5V1.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideoCard({ video, index }: { video: Video; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden shadow-lg bg-black/20"
    >
      <div className="aspect-video">
        <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
      </div>
      <div className="px-6 py-5 flex items-center justify-between gap-6 bg-black/20">
        <div className="flex-1 min-w-0">
          <p className="text-primary font-semibold text-base leading-snug">
            {video.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {video.duration && (
              <>
                <span className="text-primary/60 text-sm">{video.duration}</span>
                <span className="text-primary/40 text-sm">•</span>
              </>
            )}
            <span className="text-primary/60 text-sm">{video.caption}</span>
          </div>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-accent text-xs font-semibold uppercase tracking-widest shrink-0 hover:opacity-70 transition-opacity"
          aria-label={`Watch ${video.title} on YouTube`}
        >
          Watch on YouTube
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-accent/60">
            <PlayIcon />
          </span>
        </a>
      </div>
    </motion.div>
  );
}

export function MusicVideos({
  description,
  watchMoreUrl,
  videos,
}: MusicVideosProps) {
  if (!videos || videos.length === 0) return null;

  const hasWatchMore = watchMoreUrl && watchMoreUrl !== "#";

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <div className="flex flex-col items-center gap-6 mt-16 pt-16">
      {/* Gradient fade-in transition from track list above */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-4" />

      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-4 mb-12"
      >
        {/* Animated equalizer flanked by rules */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-10 bg-accent/50" />
          <span className="text-accent">
            <EqualizerIcon />
          </span>
          <div className="h-px w-10 bg-accent/50" />
        </div>

        <h2 className="text-primary text-5xl lg:text-6xl font-medium tracking-[0.35em] uppercase mb-5">
          Watch
        </h2>

        <div className="h-px w-14 bg-accent mb-8" />

        <p className="text-primary/70 text-base leading-relaxed max-w-md">
          {description.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      </motion.div>

      {/* Video cards */}
      <div className="flex flex-col gap-10 w-full max-w-2xl mx-auto">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}
      </div>

      {/* View more button */}
      {hasWatchMore && (
        <div className="flex justify-center mt-10">
          <a
            href={watchMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-3.5 rounded-full border border-accent text-accent text-xs font-semibold uppercase tracking-[0.2em] hover:bg-accent/10 transition-colors"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-accent shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-2.5 h-2.5 fill-current ml-0.5"
                aria-hidden
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </span>
            View More Videos
          </a>
        </div>
      )}
    </div>
  );
}
