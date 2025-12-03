"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import booksData from "../../data/books-data.json";
import { clsx } from "clsx";
import { getYearFromDate } from "../../../lib/date-utils";

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
  purchaseLinks?: {
    label: string;
    url: string;
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
            "relative w-full h-auto transition-all duration-300 ease-in-out",
            {
              "flex justify-center": showDetails,
            }
          )}
        >
          <div className="flex items-start justify-center md:justify-start group">
            <Image
              src={featured.image || "/placeholder.svg"}
              alt={featured.title}
              width={350}
              height={350}
              className={clsx(
                "rounded-xl object-cover transition-transform duration-500",
                {
                  "border border-white": featured.id === "threads",
                }
              )}
              quality={100}
              priority
            />
          </div>

          {/* FEATURED PREVIEW CONTENT */}
          <div
            className={clsx(
              "bg-primary absolute w-4/5 rounded-2xl shadow-2xl p-6 max-w-2xl sm:p-8 md:w-3/5 top-[100px] right-0 lg:right-5 lg:p-10 lg:top-[125px] lg:w-1/2 transition-all duration-500 ease-in-out transform",
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
              <div>
                <h2 className="mb-4 text-3xl font-bold leading-tight text-black sm:text-2xl text-balance transition-colors duration-300 lg:text-3xl group-hover:text-gray-700">
                  {featured.title}
                </h2>
                {featured.date && (
                  <p className="bg-secondary rounded-lg py-1 mb-4 text-xs font-medium tracking-widest text-black/90 transition-colors duration-300 group-hover:text-black">
                    {getYearFromDate(featured.date)}
                  </p>
                )}
              </div>
              <p
                className="mb-6 text-sm leading-relaxed text-black/80 sm:text-base lg:text-lg line-clamp-3 transition-colors duration-300 md:line-clamp-4 lg:line-clamp-3 group-hover:text-black/60"
                dangerouslySetInnerHTML={{ __html: featured.summary[0] }}
              />
            </button>
            {/* </Link> */}
          </div>
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
                  <p
                    className="text-base leading-relaxed text-white lg:text-[22px] transition-colors duration-300 group-hover:text-black/60"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                  {index !== featured.summary.length - 1 && <br />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Links Section */}
        {featured.purchaseLinks && featured.purchaseLinks.length > 0 && (
          <div className="w-full flex flex-col justify-start gap-4">
            <h3 className="mb-6 text-2xl font-medium tracking-widest text-primary uppercase lg:mb-8">
              Get your copy
            </h3>
            {featured.purchaseLinks.length === 1 ? (
              <a
                href={featured.purchaseLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-br from-accent to-accent-hover text-white font-semibold rounded-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 w-full text-center text-base"
              >
                {featured.purchaseLinks[0].label}
              </a>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                {featured.purchaseLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-br from-accent to-accent-hover text-white font-medium rounded-full transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 w-full text-center text-base"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FEATURED TESTIMONIAL */}
        {featured.testimonials.length > 0 && (
          <div className="w-full flex flex-col justify-between gap-4">
            <h4 className="mb-6 text-2xl font-medium tracking-widest text-primary uppercase lg:mb-8">
              Praise & Reviews
            </h4>
            <div className="flex flex-col gap-6">
              {featured.testimonials.map((testimonial, index) => (
                <div key={index}>
                  <p
                    className="text-primary mb-4 text-lg"
                    dangerouslySetInnerHTML={{ __html: testimonial.message }}
                  />
                  <div className="flex flex-col gap-1 text-end">
                    <span className="font-semibold test-base text-primary">
                      {testimonial.name}
                    </span>
                    {testimonial.title && (
                      <span
                        className="block text-base text-primary"
                        dangerouslySetInnerHTML={{ __html: testimonial.title }}
                      />
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
              <div
                className={clsx(
                  "relative aspect-[2/3] overflow-hidden rounded-xl w-1/3 lg:w-full lg:max-w-[150px]",
                  {
                    "border border-white": book.id === "threads",
                  }
                )}
              >
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Book Simple Details */}
              <div className="flex-1 flex flex-col justify-center gap-2">
                <h4 className="text-xl font-bold leading-tight text-primary sm:text-xl lg:text-2xl text-balance">
                  {book.title}
                </h4>
                <span className="mb-2 text-xs font-medium tracking-widest text-primary">
                  {[
                    book.date && getYearFromDate(book.date),
                    book.publicationStatus,
                  ]
                    .filter(Boolean)
                    .join(" / ")}
                </span>
                {/* Add description or other details here */}
                <p
                  className="mt-2 text-sm leading-relaxed text-primary/80 line-clamp-2 transition-colors duration-300 lg:line-clamp-3 group-hover:text-primary/60"
                  dangerouslySetInnerHTML={{ __html: book.summary[0] }}
                />
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
                      target="_blank"
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
