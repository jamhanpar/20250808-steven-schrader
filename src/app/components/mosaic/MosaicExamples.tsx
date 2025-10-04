// Example usage of the MosaicGallery component

import React from "react";
import MosaicGallery, { MosaicItem } from "./Mosaic";
import {
  sampleMosaicData,
  largeMosaicData,
  testMosaicData,
} from "../../data/mosaicData";

// Basic usage example
export const BasicMosaicExample: React.FC = () => {
  const handleItemClick = (item: MosaicItem, index: number) => {
    console.log(`Clicked on item: ${item.title} at index ${index}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        Steven&apos;s Life in Pictures
      </h2>
      <MosaicGallery items={sampleMosaicData} onItemClick={handleItemClick} />
    </div>
  );
};

// Customized usage example
export const CustomizedMosaicExample: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Gallery with Custom Settings</h2>
      <MosaicGallery
        items={largeMosaicData}
        className="custom-gallery"
        itemClassName="custom-item"
        maxColumns={3}
        gap={20}
        enableLazyLoad={true}
        animations={true}
        onItemClick={(item) => {
          // Custom click handler
          console.log(`Viewing: ${item.title}`);
        }}
      />
    </div>
  );
};

// Example with error handling testing
export const ErrorTestingExample: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        Gallery with Error Handling Test
      </h2>
      <MosaicGallery
        items={testMosaicData}
        animations={false} // Disable animations for testing
      />
    </div>
  );
};

// Minimal usage example
export const MinimalMosaicExample: React.FC = () => {
  const minimalData: MosaicItem[] = [
    {
      id: "1",
      url: "/images/steve-schrader-profile.jpg",
      type: "image",
      title: "Steven Schrader",
      description: "Author portrait",
      tags: ["author"],
      alt: "Steven Schrader portrait",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Single Image Gallery</h2>
      <MosaicGallery items={minimalData} />
    </div>
  );
};

// About page implementation example
export const AboutPageMosaicSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Life Through the Lens</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the moments and experiences that have shaped Steven&apos;s
            journey as a writer and storyteller.
          </p>
        </div>

        <MosaicGallery
          items={sampleMosaicData}
          maxColumns={4}
          gap={16}
          enableLazyLoad={true}
          animations={true}
          className="mb-8"
        />

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Click any image to view in full screen
          </p>
        </div>
      </div>
    </section>
  );
};

export default BasicMosaicExample;
