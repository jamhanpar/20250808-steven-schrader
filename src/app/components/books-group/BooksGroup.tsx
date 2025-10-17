import Image from "next/image";
import Link from "next/link";
import booksData from "app/data/books-data.json";
import { clsx } from "clsx";

export function BooksSection() {
  const { featured, popular } = booksData;

  return (
    <div className="flex flex-col gap-20 w-full lg:flex-row lg:justify-between">
      {/* Featured Book */}
      <div className="relative min-h-[500px] flex-1 flex justify-center items-center md:justify-start lg:flex-3/5 lg:items-start">
        {/* Featured Image */}
        <div className="flex items-center justify-center group md:w-auto lg:justify-start lg:max-h-[700px]">
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

        {/* Featured Content */}
        <div className="bg-primary absolute bottom-[-40px] w-4/5 rounded-2xl shadow-2xl p-6 max-w-2xl sm:p-8 md:w-2/3 md:bottom-auto md:right-0 md:top-[230px] lg:p-10 lg:top-[130px] lg:w-1/2">
          <Link href={featured.link} className="group flex flex-col gap-6">
            <p className="bg-secondary rounded-lg absolute top-[-10px] py-1 px-2 mb-4 text-xs font-medium tracking-widest text-black/90 transition-colors duration-300 group-hover:text-black">
              {featured.date}
            </p>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-black sm:text-2xl text-balance transition-colors duration-300 lg:text-3xl group-hover:text-gray-700">
              {featured.title}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-black/80 sm:text-base lg:text-lg line-clamp-3 transition-colors duration-300 lg:line-clamp-5 group-hover:text-black/60">
              {featured.description}
            </p>
          </Link>
        </div>
      </div>

      {/* Popular Books */}
      <div className="flex flex-col gap-8 lg:flex-2/5">
        <h3 className="mb-6 text-2xl font-medium tracking-widest text-primary lg:mb-8">
          POPULAR BOOKS
        </h3>
        <div className="flex flex-col gap-8 md:gap-6 space-y-6 md:items-center md:grid md:grid-cols-2 lg:grid-cols-1">
          {popular.map((book, index) => (
            <Link
              key={book.id}
              href={book.link}
              className={clsx(
                "group flex gap-6 transition-opacity hover:opacity-80"
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
