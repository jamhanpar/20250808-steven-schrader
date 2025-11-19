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
        <h1 className="text-primary text-4xl font-bold mb-2">
          {authorData.pageTitle}
        </h1>
        {authorData.biography.map((paragraph, index) => (
          <p key={index} className="text-primary text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
