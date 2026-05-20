"use client";

import { useAudioPlayer } from "../audio-player-provider/AudioPlayerProvider";
import { formatDuration } from "../../../lib/audio-utils";
import type { Track } from "../../../types/audio";
import "./MusicTrackList.css";

interface MusicTrackListProps {
  tracks: Track[];
  coverImage: string;
}

export function MusicTrackList({ tracks, coverImage }: MusicTrackListProps) {
  const { currentIndex, isPlaying, isPlayerVisible, loadPlaylist, toggle } =
    useAudioPlayer();

  const handleTrackClick = (index: number) => {
    if (isPlayerVisible && currentIndex === index) {
      // Same track — toggle play / pause
      toggle();
    } else {
      // New track — inject coverImage then start playlist
      const tracksWithCover = tracks.map((t) => ({ ...t, coverImage }));
      loadPlaylist(tracksWithCover, index);
    }
  };

  const isActive = (index: number) => isPlayerVisible && currentIndex === index;

  return (
    <div className="music-track-list">
      {tracks.map((track, index) => (
        <button
          key={track.id}
          onClick={() => handleTrackClick(index)}
          className={`music-track-list__item${isActive(index) ? " music-track-list__item--active" : ""}`}
          aria-label={`Play ${track.title}`}
          aria-pressed={isActive(index)}
        >
          {/* Number / now-playing indicator */}
          <span className="music-track-list__index">
            {isActive(index) && isPlaying ? (
              <span
                className="music-track-list__playing-bars"
                aria-label="Now playing"
              >
                <span />
                <span />
                <span />
              </span>
            ) : isActive(index) && !isPlaying ? (
              <span className="music-track-list__paused-icon" aria-label="Paused">
                ▶
              </span>
            ) : (
              <span className="music-track-list__number">{index + 1}</span>
            )}
          </span>

          {/* Title */}
          <span className="music-track-list__title">{track.title}</span>

          {/* Duration */}
          <span className="music-track-list__duration">
            {formatDuration(track.duration)}
          </span>
        </button>
      ))}
    </div>
  );
}
