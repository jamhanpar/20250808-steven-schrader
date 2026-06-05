"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Track } from "../../../types/audio";

interface AudioPlayerContextType {
  playlist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isPlayerVisible: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  loadPlaylist: (tracks: Track[], startIndex: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  dismiss: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export function useAudioPlayer(): AudioPlayerContextType {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx)
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parallel refs keep callbacks free of stale closures
  const playlistRef = useRef<Track[]>([]);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep refs in sync with state
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const isPlayerVisible = playlist.length > 0;

  const playTrack = useCallback((tracks: Track[], index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = tracks[index].src;
    audio.load();
    audio.play().catch(console.error);
  }, []);

  const loadPlaylist = useCallback(
    (tracks: Track[], startIndex: number) => {
      playlistRef.current = tracks;
      currentIndexRef.current = startIndex;
      isPlayingRef.current = true;
      setPlaylist(tracks);
      setCurrentIndex(startIndex);
      setIsPlaying(true);
      playTrack(tracks, startIndex);
    },
    [playTrack]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlayingRef.current) {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  }, []);

  const next = useCallback(() => {
    const pl = playlistRef.current;
    if (pl.length === 0) return;
    const nextIdx = (currentIndexRef.current + 1) % pl.length;
    currentIndexRef.current = nextIdx;
    setCurrentIndex(nextIdx);
    isPlayingRef.current = true;
    setIsPlaying(true);
    playTrack(pl, nextIdx);
  }, [playTrack]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    const pl = playlistRef.current;
    if (pl.length === 0) return;
    // If more than 3s in, restart the current track instead of going back
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prevIdx =
      (currentIndexRef.current - 1 + pl.length) % pl.length;
    currentIndexRef.current = prevIdx;
    setCurrentIndex(prevIdx);
    isPlayingRef.current = true;
    setIsPlaying(true);
    playTrack(pl, prevIdx);
  }, [playTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  const dismiss = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    playlistRef.current = [];
    currentIndexRef.current = 0;
    isPlayingRef.current = false;
    setPlaylist([]);
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  // Auto-advance when a track finishes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const pl = playlistRef.current;
      const ci = currentIndexRef.current;
      if (ci < pl.length - 1) {
        const nextIdx = ci + 1;
        currentIndexRef.current = nextIdx;
        setCurrentIndex(nextIdx);
        playTrack(pl, nextIdx);
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [playTrack]);

  return (
    <AudioPlayerContext.Provider
      value={{
        playlist,
        currentIndex,
        isPlaying,
        isPlayerVisible,
        audioRef,
        loadPlaylist,
        toggle,
        next,
        prev,
        seek,
        dismiss,
      }}
    >
      {/* Single persistent <audio> element — never unmounted */}
      <audio ref={audioRef} preload="none" />
      {children}
    </AudioPlayerContext.Provider>
  );
}
