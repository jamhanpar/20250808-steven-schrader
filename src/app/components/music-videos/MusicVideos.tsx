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

function EqualizerIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
      <rect x="0" y="5" width="4" height="13" rx="2" fill="currentColor" />
      <rect x="9" y="0" width="4" height="18" rx="2" fill="currentColor" />
      <rect x="18" y="3" width="4" height="15" rx="2" fill="currentColor" />
    </svg>
  );
}

function YouTubeIconButton() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-accent">
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
        <polygon points="4,1 12,5 4,9" fill="white" />
      </svg>
    </span>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-black/20">
      <div className="aspect-video">
        <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
      </div>
      <div className="px-5 py-4 flex items-center justify-between gap-4 bg-black/20">
        <div className="flex-1 min-w-0">
          <p className="text-primary font-semibold text-base leading-snug">
            {video.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {video.duration && (
              <>
                <span className="text-primary/60 text-sm">
                  {video.duration}
                </span>
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
          className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest shrink-0 hover:opacity-80 transition-opacity"
          aria-label={`Watch ${video.title} on YouTube`}
        >
          Watch on
          <YouTubeIconButton />
        </a>
      </div>
    </div>
  );
}

export function MusicVideos({
  description,
  watchMoreUrl,
  videos,
}: MusicVideosProps) {
  if (!videos || videos.length === 0) return null;

  const hasWatchMore = watchMoreUrl && watchMoreUrl !== "#";

  return (
    <div className="flex flex-col items-center gap-6 mt-16 pt-16">
      {/* Centered section header */}
      <div className="flex flex-col items-center text-center gap-4 mb-12">
        {/* Equalizer icon flanked by rules */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-10 bg-accent/50" />
          <span className="text-accent">
            <EqualizerIcon />
          </span>
          <div className="h-px w-10 bg-accent/50" />
        </div>

        {/* WATCH title */}
        <h2 className="text-primary text-5xl lg:text-6xl font-medium tracking-[0.35em] uppercase mb-5">
          Watch
        </h2>

        {/* Orange underline */}
        <div className="h-px w-14 bg-accent mb-8" />

        {/* Description */}
        <p className="text-primary/70 text-base leading-relaxed max-w-md">
          {description.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      {/* Video cards — vertical stack */}
      <div className="flex flex-col gap-10 w-full max-w-2xl mx-auto">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* VIEW MORE VIDEOS button */}
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
