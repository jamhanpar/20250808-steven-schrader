import MosaicGallery from "app/components/mosaic/Mosaic";
import { mosaicData } from "app/data/mosaicData";
import Section from "app/components/section/Section";
// import Image from "next/image";
// import { Timeline } from "app/components/timeline/Timeline";

// Data
// import timelineData from "../data/timelineData.js";

export default function BioPage() {
  // Example: Custom mosaic data with different featured images
  // You can uncomment and modify this to easily control which images are featured
  // const customMosaicData = sampleMosaicData.map((item, index) => ({
  //   ...item,
  //   featured: index === 2 || index === 5 // Make 3rd and 6th images featured
  // }));

  return (
    <>
      <Section classname="flex flex-col-reverse gap-8 lg:flex-row">
        {/* Left: Profile and creative image grid */}
        <div className="flex flex-col gap-6 items-center lg:w-1/2">
          <MosaicGallery items={mosaicData} />
        </div>
        {/* Right: Bio text */}
        <div className="flex flex-col gap-4 items-center lg:w-1/2 lg:items-start">
          <h1 className="text-4xl font-bold text-primary mb-2">About Me</h1>
          <p className="text-lg text-primary leading-relaxed">
            Steven Schrader was born in New York in 1935 and has spent a
            lifetime exploring the many dimensions of storytelling — both in
            life and on the page. Before becoming a writer and publisher, he
            worked as a dress salesman, social worker, and teacher, experiences
            that deepened his understanding of people and their stories. For a
            decade, he served as director of Teachers & Writers Collaborative,
            bringing poets, novelists, and other artists into classrooms to
            inspire the next generation of storytellers — a mission he continues
            today as co-chair.
          </p>
          <p className="text-lg text-primary leading-relaxed">
            As the publisher of Cane Hill Press, Schrader championed original
            voices in contemporary fiction, and his own stories have appeared in
            numerous anthologies and on National Public Radio’s Selected Shorts.
            Much of his work is rooted in New York City’s Upper West Side, where
            he lives with his wife, documentary filmmaker Lucy Kostelanetz. The
            city’s streets, rhythms, and characters are more than a backdrop in
            his fiction — they are a living part of it.
          </p>
        </div>
      </Section>
    </>
  );
}
