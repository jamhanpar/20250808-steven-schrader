"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import booksData from "../../data/books-data.json";
import { clsx } from "clsx";

// Type for a single book
export interface Book {
  id: string; // Changed from number to string to match data
  title: string;
  description: string;
  date: string | null; // Allow null since some dates are null in data
  image?: string;
  link: string;
  summary: string[];
  testimonials: {
    name: string;
    title?: string;
    message: string;
  }[];
  relatedArticles?: {
    title?: string;
    articles: {
      title: string;
      link: string;
    }[];
  };
}

interface BooksGroupProps {
  initialBookId?: string;
}

export function BooksGroup({ initialBookId }: BooksGroupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const { books, sidebar } = booksData;
  const featured = books[currentIndex];
  const sidebarBooks = books.filter((_, index) => index !== currentIndex);

  // Check URL params and set initial book on component mount
  useEffect(() => {
    let bookIndex = 0;

    // If we have an initialBookId prop (from dynamic route), use that
    if (initialBookId) {
      const foundIndex = books.findIndex((book) => book.id === initialBookId);
      if (foundIndex !== -1) {
        bookIndex = foundIndex;
      }
    }
    // Otherwise, check if we're on a dynamic route
    else if (params?.bookId) {
      const foundIndex = books.findIndex((book) => book.id === params.bookId);
      if (foundIndex !== -1) {
        bookIndex = foundIndex;
      }
    }

    setCurrentIndex(bookIndex);

    // Check preview parameter
    const previewParam = searchParams.get("preview");
    if (previewParam === "false" || previewParam === "0") {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }

    // Set loading to false after checking params
    setIsLoading(false);
  }, [searchParams, initialBookId, params?.bookId, books]);

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newShowDetails = !showDetails;
    setShowDetails(newShowDetails);

    // Update URL parameter
    const params = new URLSearchParams(searchParams.toString());
    if (newShowDetails) {
      params.set("preview", "false");
    } else {
      params.set("preview", "true");
    }

    // Maintain the current route structure
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${params.toString()}`, { scroll: false });
  };

  const handleBookChange = (newIndex: number) => {
    const selectedBook = books[newIndex];
    setCurrentIndex(newIndex);
    setShowDetails(true);

    // Reset URL to show preview
    const params = new URLSearchParams(searchParams.toString());
    params.set("preview", "false");
    router.push(`/books/${selectedBook.id}?${params.toString()}`, {
      scroll: false,
    });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div
      className={clsx(
        "flex flex-col w-full lg:flex-row lg:justify-between",
        showDetails ? "gap-10 lg:gap-20" : "gap-20"
      )}
    >
      {/* FEATURED */}
      <div className="relative min-h-[500px] flex-1 flex flex-col justify-center items-center gap-6 md:justify-start lg:flex-3/5 lg:items-start lg:gap-10">
        {/* FEATURED IMAGE */}
        <div
          className={clsx(
            "w-full h-auto transition-all duration-300 ease-in-out",
            {
              "flex justify-center": showDetails,
            }
          )}
        >
          <div className="flex items-start justify-center group md:w-2/3 lg:justify-start">
            <Image
              src={featured.image || "/placeholder.svg"}
              alt={featured.title}
              width={1000}
              height={1000}
              className="rounded-xl object-cover transition-transform duration-500 md:h-full md:w-full"
              quality={100}
              priority
            />
          </div>
        </div>

        {/* FEATURED PREVIEW CONTENT */}
        <div
          className={clsx(
            "bg-primary absolute bottom-[-40px] w-4/5 rounded-2xl shadow-2xl p-6 max-w-2xl sm:p-8 md:w-3/5 md:bottom-auto md:right-0 md:top-[400px] lg:p-10 lg:top-[200px] lg:w-1/2 transition-all duration-500 ease-in-out transform",
            showDetails
              ? "opacity-0 translate-y-4 pointer-events-none"
              : "opacity-100 translate-y-0"
          )}
        >
          {/* <Link href={featured.link} className="group flex flex-col gap-6"> */}
          <button
            onClick={handlePreviewClick}
            className="group flex flex-col gap-6 w-full text-left hover:cursor-pointer"
          >
            {featured.date && (
              <p className="bg-secondary rounded-lg absolute top-[-10px] py-1 px-2 mb-4 text-xs font-medium tracking-widest text-black/90 transition-colors duration-300 group-hover:text-black">
                {featured.date}
              </p>
            )}
            <h2 className="mb-4 text-3xl font-bold leading-tight text-black sm:text-2xl text-balance transition-colors duration-300 lg:text-3xl group-hover:text-gray-700">
              {featured.title}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-black/80 sm:text-base lg:text-lg line-clamp-4 transition-colors duration-300 lg:line-clamp-5 group-hover:text-black/60">
              {featured.summary[0]}
            </p>
          </button>
          {/* </Link> */}
        </div>

        {/* FEATURED DETAILS */}
        {showDetails && (
          <div
            className={clsx(
              "transition-all duration-500 ease-in-out transform w-full",
              showDetails
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            {/* BACK BUTTON */}
            {/* <button
              onClick={() => setShowDetails(false)}
              className="mb-6 px-4 py-2 bg-secondary text-black rounded-lg hover:bg-secondary/80 transition-colors duration-300"
            >
              ← Back to Preview
            </button> */}

            {/* FEATURED SUMMARY */}
            <div className="text-sm font-medium text-gray-700 md:top-8 md:left-8 lg:top-12 lg:left-12">
              {featured.summary.map((item, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <p className="text-base leading-relaxed text-white lg:text-lg transition-colors duration-300 group-hover:text-black/60">
                    {item}
                  </p>
                  {index !== featured.summary.length - 1 && <br />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURED TESTIMONIAL */}
        {featured.testimonials.length > 0 && (
          <div className="w-full flex flex-col justify-between gap-4">
            <h4 className="text-lg font-semibold mb-4 text-primary">
              What Readers Say
            </h4>
            <div className="flex flex-col gap-6">
              {featured.testimonials.map((testimonial, index) => (
                <div key={index}>
                  <p className="text-primary italic mb-4">
                    “{testimonial.message}”
                  </p>
                  <div className="flex flex-col gap-1 text-end">
                    <span className="font-semibold text-primary">
                      {testimonial.name}
                    </span>
                    {testimonial.title && (
                      <span className="block text-sm text-secondary">
                        {testimonial.title}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SIDEBAR */}
      <div className="flex flex-col gap-8 lg:flex-2/5">
        <h3 className="mb-6 text-2xl font-medium tracking-widest text-primary uppercase lg:mb-8">
          {sidebar.title}
        </h3>
        <div className="flex flex-col gap-8 md:gap-6 space-y-6 md:items-center md:grid md:grid-cols-2 lg:grid-cols-1">
          {sidebarBooks.map((book) => (
            <button
              key={book.id}
              onClick={() =>
                handleBookChange(
                  books.findIndex((currentIndex) => book.id === currentIndex.id)
                )
              }
              className={clsx(
                "group flex gap-6 transition-opacity hover:opacity-80 text-left w-full hover:cursor-pointer"
              )}
            >
              {/* Book Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl w-1/3 lg:w-full lg:max-w-[150px]">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Book Simple Details */}
              <div className="flex-1 flex flex-col justify-center gap-2">
                <p className="mb-2 text-xs font-medium tracking-widest text-primary">
                  {book.date}
                </p>
                <h4 className="text-xl font-bold leading-tight text-primary sm:text-xl lg:text-2xl text-balance">
                  {book.title}
                </h4>
                {/* Add description or other details here */}
                <p className="mt-2 text-sm leading-relaxed text-primary/80 line-clamp-3 lg:line-clamp-4 transition-colors duration-300 group-hover:text-primary/60">
                  {book.description}
                </p>
              </div>
            </button>
          ))}
        </div>
        {featured.relatedArticles?.articles &&
          featured.relatedArticles.articles.length > 0 && (
            <div className="flex flex-col gap-8 lg:flex-2/5">
              <h3 className="mb-6 text-2xl font-medium tracking-widest text-primary uppercase lg:mb-8">
                {featured.relatedArticles.title || "Related Articles"}
              </h3>
              <ul className="flex flex-col gap-4 mt-4">
                {featured.relatedArticles.articles.map((article, index) => (
                  <li key={index}>
                    <a
                      href={article.link}
                      className="text-primary hover:underline"
                    >
                      {article.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
