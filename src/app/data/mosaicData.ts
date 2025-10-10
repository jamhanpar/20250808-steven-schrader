// Sample data for the MosaicGallery component with Unsplash images
import { MosaicItem } from "../components/mosaic/Mosaic";

export const mosaicData: MosaicItem[] = [
  {
    id: "1",
    url: "/images/steve-schrader-author.jpg",
    type: "image",
    title: "Steven Schrader - Author Portrait",
    description:
      "Professional portrait of Steven Schrader, capturing his thoughtful demeanor as an accomplished writer and storyteller.",
    tags: ["portrait", "professional", "author"],
    alt: "Professional portrait of Steven Schrader",
    captureDate: "2023-06-15",
    location: "New York, NY",
    featured: true,
  },
  {
    id: "2",
    url: "/images/threads-history-1-childhood.jpeg",
    type: "image",
    title: "Writing Desk & Inspiration",
    description:
      "The writer's sanctuary - where countless stories have been born, edited, and refined into literary works.",
    tags: ["writing", "desk", "workspace", "books"],
    alt: "Writing desk with books and papers",
    captureDate: "2023-04-12",
    location: "Home Office",
  },
  {
    id: "3",
    url: "/images/threads-history-2-boyhood.jpeg",
    type: "image",
    title: "Literary Collection",
    description:
      "A glimpse into Steven's extensive library - the foundation of knowledge that informs his storytelling.",
    tags: ["books", "library", "literature", "collection"],
    alt: "Shelves filled with books in a library setting",
    captureDate: "2023-03-08",
    location: "Personal Library",
  },
  {
    id: "4",
    url: "/images/threads-history-3-group.jpg",
    type: "image",
    title: "Creative Process",
    description:
      "The intimate moment of creation - where thoughts become words and words become stories.",
    tags: ["writing", "creativity", "process", "handwriting"],
    alt: "Hand writing in a notebook with pen",
    captureDate: "2023-01-20",
    location: "Café in Greenwich Village",
  },
  {
    id: "5",
    url: "/images/threads-history-4-guitar.jpeg",
    type: "image",
    title: "Book Reading Event",
    description:
      "Steven engaging with his audience during a book reading, sharing stories that resonate with readers.",
    tags: ["event", "reading", "audience", "performance"],
    alt: "Author at a book reading event",
    captureDate: "2023-05-22",
    location: "McNally Jackson Books",
  },
  {
    id: "6",
    url: "/images/threads-history-5-working.jpeg",
    type: "image",
    title: "Urban Inspiration",
    description:
      "The streets of New York - a constant source of characters, stories, and inspiration for Steven's work.",
    tags: ["nyc", "street", "inspiration", "urban"],
    alt: "New York City street scene",
    captureDate: "2023-07-15",
    location: "Upper West Side, NYC",
  },
];

// Additional sample data for testing different scenarios
export const largeMosaicData: MosaicItem[] = [
  ...mosaicData,
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop",
    type: "image",
    title: "Literary Awards Ceremony",
    description:
      "Recognition for outstanding contributions to literature - a celebration of artistic achievement.",
    tags: ["award", "ceremony", "recognition", "achievement"],
    alt: "Awards ceremony or formal literary event",
    captureDate: "2023-11-20",
    location: "Lincoln Center",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    type: "image",
    title: "Quiet Contemplation",
    description:
      "Moments of solitude and reflection - essential ingredients in the creative writing process.",
    tags: ["contemplation", "solitude", "reflection", "nature"],
    alt: "Peaceful nature scene for contemplation",
    featured: true,
    captureDate: "2023-10-08",
    location: "Central Park",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
    type: "image",
    title: "The Editing Process",
    description:
      "The meticulous craft of revision - where good writing becomes great literature.",
    tags: ["editing", "revision", "craft", "manuscript"],
    alt: "Manuscript pages with edits and corrections",
    captureDate: "2023-07-03",
    location: "Home Study",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    type: "image",
    title: "Community of Writers",
    description:
      "Collaboration and fellowship among writers - the importance of literary community.",
    tags: ["community", "collaboration", "fellowship", "writers"],
    alt: "Group of people in discussion or meeting",
    captureDate: "2023-09-18",
    location: "Writers' Guild",
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face",
    type: "image",
    title: "Research and Inspiration",
    description:
      "Deep research into character and place - the foundation of authentic storytelling.",
    tags: ["research", "books", "study", "preparation"],
    alt: "Research materials and books spread on desk",
    captureDate: "2023-06-28",
    location: "New York Public Library",
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    type: "image",
    title: "Author in Conversation",
    description:
      "Engaging dialogue about literature, life, and the art of storytelling.",
    tags: ["interview", "conversation", "dialogue", "media"],
    alt: "Author in interview or conversation setting",
    captureDate: "2023-08-25",
    location: "NPR Studios",
  },
];

// Example with error handling (broken image URLs for testing)
export const testMosaicData: MosaicItem[] = [
  ...mosaicData.slice(0, 2),
  {
    id: "broken-1",
    url: "/images/does-not-exist.jpg",
    type: "image",
    title: "Test Broken Image",
    description:
      "This image URL is intentionally broken to test error handling.",
    tags: ["test", "error"],
    alt: "Test image that should show error state",
    captureDate: "2023-01-01",
  },
  ...mosaicData.slice(2),
];

export default mosaicData;
