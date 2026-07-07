import Link from "next/link";
import MosaicGallery, { MosaicItem } from "app/components/mosaic/Mosaic";
import Section from "app/components/section/Section";
import authorData from "app/data/about-data.json";
import mosaicDataJson from "app/data/about-mosaic-data.json";

export default function BioPage() {
  return (
    <Section classname="flex flex-col-reverse gap-8 lg:flex-row">
      {/*--- Left: Profile and creative image grid ---*/}
      <div className="flex flex-col gap-6 items-center lg:w-1/2 lg:pt-[60px]">
        <MosaicGallery
          items={mosaicDataJson.mosaicData as MosaicItem[]}
          maxColumns={3}
        />
      </div>
      {/*--- Right: Bio text ---*/}
      <div className="flex flex-col gap-4 items-center lg:w-1/2 lg:items-start">
        <h1 className="mb-6 text-2xl font-medium tracking-widest text-primary uppercase lg:mb-8">
          {authorData.pageTitle}
        </h1>
        {authorData.biography.map((paragraph, index) => (
          <p key={index} className="text-primary text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
        <p className="text-primary text-lg leading-relaxed">
          Read an interview with Steven Schrader in the{" "}
          <a
            href="https://www.westsiderag.com/2026/01/05/a-lifetime-on-the-uws-a-90-year-old-authors-new-memoir-reflects-on-a-changing-new-york"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:opacity-80 transition-opacity"
          >
            West Side Rag
          </a>{" "}
          by Margie Smith Holt (January 5, 2026)
        </p>
        <p className="text-primary text-lg leading-relaxed">
          Listen to Steve reading a story from his book,{" "}
          <Link href="/books/threads" className="text-accent hover:opacity-80 transition-opacity">
            <em>Threads</em>
          </Link>
          , on the{" "}
          <a
            href="https://www.youtube.com/watch?v=GrzN1Mu80bI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:opacity-80 transition-opacity"
          >
            Fordham University Radio station
          </a>{" "}
          (2012)
        </p>
      </div>
    </Section>
  );
}
