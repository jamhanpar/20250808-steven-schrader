// Integration example: How to update the About page with the new MosaicGallery

import MosaicGallery from "app/components/mosaic/Mosaic";
import { sampleMosaicData } from "app/data/mosaicData";
import Section from "app/components/section/Section";

export default function UpdatedBioPage() {
  return (
    <>
      {/* Hero section with existing single image */}
      <Section>
        <MosaicGallery
          items={[
            {
              id: "hero",
              url: "/images/steve-schrader-bio.png",
              type: "image",
              title: "Steven Schrader",
              description:
                "Author and storyteller, capturing life's moments through words.",
              tags: ["author", "biography"],
              alt: "Steven Schrader biographical image",
            },
          ]}
          maxColumns={1}
          gap={8}
          animations={false}
        />
      </Section>

      {/* Main bio section */}
      <Section>
        {/* Left: Profile and creative image grid - REPLACE with new MosaicGallery */}
        <div className="flex flex-col gap-6 items-center md:w-1/2">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Life in Pictures
          </h2>
          <MosaicGallery
            items={sampleMosaicData}
            maxColumns={2}
            gap={12}
            className="max-w-md"
          />
        </div>

        {/* Right: Bio text - KEEP EXISTING */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-primary mb-2">About Me</h1>
          <p className="text-lg text-foreground leading-relaxed">
            Steven Schrader was born in New York in 1935. He has been a dress
            salesman, a social worker, and a junior high and high school
            teacher. For ten years he was director of Teachers & Writers
            Collaborative, an arts organization that sends writers and other
            artists into schools and he is now the co-chair. He was the
            publisher of Cane Hill Press, which specialized in fiction. His work
            has been included in several anthologies and broadcast on National
            Public Radio&apos;s Selected Shorts. He lives on New York&apos;s
            Upper West Side, a strong presence in his stories, with his wife,
            Lucy Kostelanetz, a documentary film maker.
          </p>
          <p className="text-md text-muted-foreground">
            Click any image to explore Steven&apos;s journey through life and
            literature.
          </p>
        </div>
      </Section>

      {/* Optional: Full-width gallery section */}
      <Section classname="bg-gray-50 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">A Life Well Lived</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From teaching to writing, from dress sales to literary awards -
            explore the rich tapestry of experiences that shaped Steven&apos;s
            unique voice.
          </p>
        </div>

        <MosaicGallery
          items={sampleMosaicData}
          maxColumns={4}
          gap={16}
          className="mb-8"
        />
      </Section>
    </>
  );
}

/*
MIGRATION STEPS:

1. Replace the existing about/page.tsx with this implementation
2. Update image paths in sampleData.ts to match your actual images
3. Add more images to the public/images folder as needed
4. Customize the MosaicItem data with real information about Steven
5. Test responsive behavior on different screen sizes
6. Adjust styling to match your design system

QUICK INTEGRATION (Minimal Change):
If you want to keep most of the existing layout and just replace the
creative image grid, replace this section:

```tsx
// OLD: Creative image grid
<div className="grid grid-cols-3 grid-rows-2 gap-2 w-64 h-40">
  // ... existing grid code
</div>

// NEW: MosaicGallery replacement
<MosaicGallery
  items={sampleMosaicData}
  maxColumns={2}
  gap={8}
  className="w-64"
/>
```
*/
