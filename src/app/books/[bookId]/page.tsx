import { BooksGroup } from "../../components/books-group/BooksGroup";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "../../components/loading/Loading";
import booksData from "../../data/books-data.json";

interface BookPageProps {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ preview?: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function getIsbn(purchaseLinks?: { label: string; url: string }[]) {
  const bookshopLink = purchaseLinks?.find((link) => link.label === "Bookshop");
  return bookshopLink?.url.match(/[?&]ean=(\d{10,13})/)?.[1];
}

function getBookSchema(book: (typeof booksData.books)[number]) {
  const publisherLink = book.purchaseLinks?.find(
    (link) => link.label === "Hanging Loose Press"
  );
  const isbn = getIsbn(book.purchaseLinks);

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: "Steven Schrader",
    },
    ...(publisherLink && {
      publisher: {
        "@type": "Organization",
        name: publisherLink.label,
        url: publisherLink.url,
      },
    }),
    ...(isbn && { isbn }),
    url: `${SITE_URL}/books/${book.id}`,
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;

  // Find the book by ID to verify it exists
  const book = booksData.books.find((book) => book.id === bookId);

  if (!book) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBookSchema(book)) }}
      />
      <Suspense fallback={<Loading size="lg" text="Loading book details..." />}>
        <BooksGroup initialBookId={bookId} />
      </Suspense>
    </div>
  );
}

// Generate static params for all books (optional, for better performance)
export async function generateStaticParams() {
  return booksData.books.map((book) => ({
    bookId: book.id,
  }));
}

// Generate metadata for each book page
export async function generateMetadata({ params }: BookPageProps) {
  const { bookId } = await params;
  const book = booksData.books.find((book) => book.id === bookId);

  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return {
    title: book.title,
    description: book.description,
  };
}
