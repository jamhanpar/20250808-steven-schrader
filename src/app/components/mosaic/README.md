# MosaicGallery Component

A highly customizable, responsive React component for displaying image galleries with a modern mosaic layout. Perfect for showcasing life experiences, portfolios, or any collection of images.

## Features

✅ **Responsive Design** - Automatically adapts to different screen sizes
✅ **Featured Items** - Highlight important images with larger display
✅ **Full-Screen Modal** - Click to view images in detail with metadata
✅ **Lazy Loading** - Optimize performance with intersection observer
✅ **Loading States** - Elegant skeleton loading and error handling
✅ **Keyboard Navigation** - Full accessibility support
✅ **Smooth Animations** - Subtle hover effects and transitions
✅ **Custom Styling** - CSS custom properties for theming
✅ **TypeScript Support** - Full type safety

## Installation

The component is already included in your project. Simply import it:

```tsx
import MosaicGallery from "./components/mosaic/Mosaic";
import type { MosaicItem } from "./components/mosaic/Mosaic";
```

## Basic Usage

```tsx
import React from "react";
import MosaicGallery, { MosaicItem } from "./components/mosaic/Mosaic";

const galleryData: MosaicItem[] = [
  {
    id: "1",
    url: "/images/photo1.jpg",
    type: "image",
    title: "Beautiful Sunset",
    description: "A stunning sunset captured during our evening walk.",
    tags: ["nature", "sunset", "photography"],
    alt: "Colorful sunset over mountains",
    featured: true, // This image will be displayed larger
    captureDate: "2023-06-15",
    location: "Yosemite National Park",
  },
  // ... more items
];

export const MyGallery = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
      <MosaicGallery items={galleryData} />
    </div>
  );
};
```

## API Reference

### MosaicGalleryProps

| Prop             | Type                                        | Default      | Description                                |
| ---------------- | ------------------------------------------- | ------------ | ------------------------------------------ |
| `items`          | `MosaicItem[]`                              | **required** | Array of items to display                  |
| `className`      | `string`                                    | `""`         | Additional CSS class for the container     |
| `itemClassName`  | `string`                                    | `""`         | Additional CSS class for each item         |
| `maxColumns`     | `number`                                    | `4`          | Maximum number of columns on large screens |
| `gap`            | `number`                                    | `16`         | Gap between items in pixels                |
| `enableLazyLoad` | `boolean`                                   | `true`       | Enable lazy loading for performance        |
| `animations`     | `boolean`                                   | `true`       | Enable hover animations and transitions    |
| `onItemClick`    | `(item: MosaicItem, index: number) => void` | `undefined`  | Callback when an item is clicked           |

### MosaicItem Interface

```tsx
interface MosaicItem {
  id: string; // Unique identifier
  url: string; // Image URL
  type: "image" | "video"; // Content type (video support in Phase 2)
  title: string; // Display title
  description: string; // Detailed description
  tags: string[]; // Array of tags
  alt: string; // Accessibility description
  aspectRatio?: string; // Optional aspect ratio
  featured?: boolean; // Display as featured (larger) item
  captureDate?: string; // When the image was taken
  location?: string; // Where the image was taken
}
```

## Responsive Breakpoints

The component automatically adjusts its layout based on screen size:

- **Mobile** (< 480px): 1 column
- **Small** (480px - 768px): 2 columns
- **Medium** (768px - 1024px): 3 columns
- **Large** (1024px+): Configurable via `maxColumns` prop

Featured items span 2 columns and 2 rows on larger screens.

## Customization

### CSS Custom Properties

You can customize the component's appearance using CSS custom properties:

```css
:root {
  --mosaic-gap: 20px; /* Gap between items */
  --mosaic-border-radius: 12px; /* Border radius */
  --mosaic-hover-scale: 1.03; /* Hover scale factor */
  --mosaic-transition-duration: 0.4s; /* Animation duration */
  --mosaic-shadow-hover: 0 12px 30px rgba(0, 0, 0, 0.2);
}
```

### Custom Styling

```tsx
<MosaicGallery
  items={data}
  className="my-custom-gallery"
  itemClassName="my-custom-item"
  maxColumns={3}
  gap={24}
/>
```

```css
.my-custom-gallery {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 1rem;
}

.my-custom-item {
  border: 2px solid transparent;
}

.my-custom-item:hover {
  border-color: #3b82f6;
}
```

## Advanced Examples

### Featured Gallery with Custom Handling

```tsx
const handleImageClick = (item: MosaicItem, index: number) => {
  // Custom analytics or tracking
  console.log(`Viewed: ${item.title}`);

  // Custom modal logic
  // openCustomModal(item);
};

<MosaicGallery
  items={featuredImages}
  maxColumns={3}
  gap={20}
  onItemClick={handleImageClick}
  className="featured-gallery"
/>;
```

### Performance Optimized Gallery

```tsx
<MosaicGallery
  items={largeImageCollection}
  enableLazyLoad={true}
  animations={false} // Disable for better performance
  maxColumns={5}
/>
```

## Accessibility Features

- **Keyboard Navigation**: Tab through items, Enter/Space to open
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Visual focus indicators and modal focus trapping
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Browser Support

- ✅ Chrome (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)

## Performance Considerations

1. **Lazy Loading**: Images load only when they come into view
2. **Image Optimization**: Use Next.js Image component with proper sizing
3. **Intersection Observer**: Efficient viewport detection
4. **CSS Transforms**: Hardware-accelerated animations
5. **Memory Management**: Proper cleanup of event listeners

## Error Handling

The component gracefully handles:

- Broken image URLs (shows placeholder)
- Network errors during loading
- Missing metadata (optional fields)
- Invalid image formats

## Upcoming Features (Phase 2)

- 🎥 Video support
- 🔍 Search and filtering
- 📱 Touch gestures for mobile
- 🎯 Virtual scrolling for large datasets
- 🎨 More animation options

## Contributing

When adding new features:

1. Update the TypeScript interfaces
2. Add corresponding CSS styles
3. Update this documentation
4. Test with different data scenarios
5. Ensure accessibility compliance

## Examples

Check out the `MosaicExamples.tsx` file for complete implementation examples including:

- Basic usage
- Custom styling
- Error handling
- Integration patterns

## Support

For questions or issues with this component, please refer to the project documentation or create an issue in the repository.
