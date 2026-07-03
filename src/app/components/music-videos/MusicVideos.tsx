import { YouTubeEmbed } from "../youtube-embed/YouTubeEmbed";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  caption: string;
}

interface MusicVideosProps {
  headline: string;
  description: string;
  watchMoreUrl: string;
  videos: Video[];
}

function VideoCaption({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="mt-6">
      <p className="text-primary text-base font-medium">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-accent text-xs">╱</span>
        <p className="text-primary/60 text-sm">{caption}</p>
      </div>
    </div>
  );
}

export function MusicVideos({
  headline,
  description,
  videos,
}: MusicVideosProps) {
  if (!videos || videos.length < 2) return null;

  const [featured, companion] = videos;

  return (
    <div className="mt-10 lg:mt-16">
      {/* Orange top rule */}
      <div className="h-px bg-accent mb-6" />

      {/* VIDEOS eyebrow */}
      <p className="text-accent text-xs uppercase tracking-widest font-medium mb-6 pt-6 pb-4">
        Videos
      </p>

      {/* Two-column grid — items-stretch ensures both columns share row height */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12 lg:items-stretch">
        {/* Left column: headline + featured video */}
        <div className="flex flex-col gap-4">
          <h2
            className="text-primary text-4xl lg:text-5xl font-medium mb-7"
            style={{ lineHeight: 1.15 }}
          >
            {headline.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <YouTubeEmbed videoId={featured.youtubeId} title={featured.title} />
          </div>
          <VideoCaption title={featured.title} caption={featured.caption} />
        </div>

        {/* Right column: description at top, companion video pushed to bottom */}
        <div className="flex flex-col h-full justify-between gap-4">
          <div>
            <p className="text-primary/70 text-base leading-relaxed md:w-1/2">
              {description}
            </p>
            {/* <a
              href={watchMoreUrl}
              className="mt-5 inline-flex items-center gap-2 text-accent text-xs uppercase tracking-widest font-medium hover:opacity-80 transition-opacity"
            >
              Watch More →
            </a> */}
          </div>

          <div className="flex flex-col mt-10 lg:mt-0 gap-4">
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <YouTubeEmbed
                videoId={companion.youtubeId}
                title={companion.title}
              />
            </div>
            <VideoCaption title={companion.title} caption={companion.caption} />
          </div>
        </div>
      </div>
    </div>
  );
}
