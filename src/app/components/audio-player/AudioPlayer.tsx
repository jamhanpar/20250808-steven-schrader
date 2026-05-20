"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAudioPlayer } from "../audio-player-provider/AudioPlayerProvider";
import { formatDuration } from "../../../lib/audio-utils";
import "./AudioPlayer.css";

export default function AudioPlayer() {
  const {
    playlist,
    currentIndex,
    isPlaying,
    isPlayerVisible,
    audioRef,
    toggle,
    next,
    prev,
    seek,
    dismiss,
  } = useAudioPlayer();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = playlist[currentIndex] ?? null;

  // Subscribe to the shared audio element's events for progress display
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioRef]);

  // Reset display when track changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(currentTrack?.duration ?? 0);
  }, [currentIndex, currentTrack]);

  const activeDuration = duration || currentTrack?.duration || 1;
  const progress =
    activeDuration > 0 ? (currentTime / activeDuration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  return (
    <AnimatePresence>
      {isPlayerVisible && currentTrack && (
        <motion.div
          className="audio-player"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 38 }}
          role="region"
          aria-label="Audio player"
        >
          {/* ── Main row ── */}
          <div className="audio-player__inner">
            {/* Cover */}
            <div className="audio-player__cover">
              <Image
                src={
                  currentTrack.coverImage ??
                  "/images/album/steve-schrader-and-friends-album-cover.jpg"
                }
                alt="Album cover"
                width={40}
                height={40}
                className="object-cover [transform:scaleY(1.02)]"
              />
            </div>

            {/* Track info */}
            <div className="audio-player__info">
              <span className="audio-player__title">{currentTrack.title}</span>
              <span className="audio-player__artist">
                Steve Schrader &amp; Friends
              </span>
            </div>

            {/* Controls */}
            <div className="audio-player__controls">
              <button
                onClick={prev}
                aria-label="Previous track"
                className="audio-player__ctrl-btn"
              >
                ⏮
              </button>
              <button
                onClick={toggle}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="audio-player__play-btn"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={next}
                aria-label="Next track"
                className="audio-player__ctrl-btn"
              >
                ⏭
              </button>
            </div>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Close player"
              className="audio-player__dismiss-btn"
            >
              ✕
            </button>
          </div>

          {/* ── Progress row ── */}
          <div className="audio-player__progress-row">
            <span className="audio-player__time">
              {formatDuration(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={activeDuration}
              step={1}
              value={currentTime}
              onChange={handleSeek}
              className="audio-player__scrubber"
              style={{ "--progress": `${progress}%` } as React.CSSProperties}
              aria-label="Seek"
            />
            <span className="audio-player__time">
              {formatDuration(currentTrack.duration)}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
