import { BooksGroup } from "../../components/books-group/BooksGroup";
import { notFound } from "next/navigation";
import booksData from "../../data/books-data.json";

interface BookPageProps {
  params: Promise<{
    bookId: string;
  }>;
  searchParams: {
    preview?: string;
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;

  // Find the book by ID to verify it exists
  const bookExists = booksData.books.find(
    (book) => book.id.toString() === bookId
  );

  if (!bookExists) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BooksGroup initialBookId={bookId} />
    </div>
  );
}

// Generate static params for all books (optional, for better performance)
export async function generateStaticParams() {
  return booksData.books.map((book) => ({
    bookId: book.id.toString(),
  }));
}

// Generate metadata for each book page
export async function generateMetadata({ params }: BookPageProps) {
  const { bookId } = await params;
  const book = booksData.books.find((book) => book.id.toString() === bookId);

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
