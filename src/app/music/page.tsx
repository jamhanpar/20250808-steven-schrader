import Image from "next/image";
import type { Metadata } from "next";
import Section from "app/components/section/Section";
import { MusicTrackList } from "../components/music-track-list/MusicTrackList";
import musicData from "app/data/music-data.json";
import type { Track } from "../../types/audio";

export const metadata: Metadata = {
  title: "Music — Steven Schrader",
  description: "Listen to Steve Schrader & Friends.",
};

export default function MusicPage() {
  return (
    <Section>
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
        {/* ── Cover art + label ── */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={musicData.coverImage}
              alt="Steve Schrader & Friends — Album Cover"
              fill
              className="object-cover [transform:scaleY(1.02)]"
              priority
            />
          </div>
          <div className="text-center">
            <p className="text-primary font-semibold text-base leading-snug">
              {musicData.albumTitle}
            </p>
            <p className="text-primary/70 text-sm mt-1">
              Album by {musicData.artist}
            </p>
            <p className="text-primary/60 text-sm mt-0.5">
              {musicData.tracks.length} tracks
            </p>
            <p className="text-primary/50 text-xs mt-3">
              Produced by {musicData.producer}
            </p>
            <p className="text-primary/50 text-xs mt-0.5">
              {musicData.copyright}
            </p>
          </div>
        </div>

        {/* ── Track list ── */}
        <div className="w-full">
          <h1 className="mb-6 text-2xl font-medium tracking-widest text-primary uppercase lg:mb-8">
            Music
          </h1>
          <MusicTrackList
            tracks={musicData.tracks as Track[]}
            coverImage={musicData.coverImage}
          />
        </div>
      </div>
    </Section>
  );
}
