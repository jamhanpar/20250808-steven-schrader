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

      {/* Headline + description */}
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
      <p className="text-primary/70 text-base leading-relaxed mb-10">
        {description}
      </p>

      {/* Single centered column — both videos the same size */}
      <div className="flex flex-col items-center gap-10">
        {[featured, companion].map((video) => (
          <div key={video.id} className="w-full max-w-2xl">
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
            </div>
            <VideoCaption title={video.title} caption={video.caption} />
          </div>
        ))}
      </div>
    </div>
  );
}
