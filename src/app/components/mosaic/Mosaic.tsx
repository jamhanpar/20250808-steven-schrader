import React from "react";
import Image from "next/image";

interface MosaicProps {
  images: string[];
  columns?: number;
  gap?: number;
}

const Mosaic: React.FC<MosaicProps> = ({ images, columns = 4, gap = 8 }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
      }}
      className="mosaic-grid w-full"
    >
      {images.map((src, idx) => (
        <div key={idx} className="mosaic-item w-full">
          <Image
            src={src}
            alt={`Mosaic ${idx}`}
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default Mosaic;

// Responsive styles
// You can add this to your global CSS or a module CSS file:
//
// .mosaic-grid {
//   grid-template-columns: repeat(2, 1fr);
// }
//
// @media (min-width: 640px) {
//   .mosaic-grid {
//     grid-template-columns: repeat(3, 1fr);
//   }
// }
// @media (min-width: 1024px) {
//   .mosaic-grid {
//     grid-template-columns: repeat(4, 1fr);
//   }
// }
// .mosaic-item img {
//   transition: transform 0.2s;
// }
// .mosaic-item img:hover {
//   transform: scale(1.03);
// }
