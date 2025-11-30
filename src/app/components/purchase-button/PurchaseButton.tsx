"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface PurchaseLink {
  label: string;
  url: string;
}

interface PurchaseButtonProps {
  purchaseLinks: PurchaseLink[];
  bookTitle: string;
}

export function PurchaseButton({
  purchaseLinks,
  bookTitle,
}: PurchaseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!purchaseLinks || purchaseLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Section Title */}
      <h3 className="text-2xl font-medium tracking-widest text-primary uppercase">
        Grab your copy at
      </h3>

      {/* If only one purchase link, show a simple button */}
      {purchaseLinks.length === 1 ? (
        <a
          href={purchaseLinks[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-300 w-full text-center"
        >
          {purchaseLinks[0].label}
        </a>
      ) : (
        // If multiple purchase links, show a dropdown
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-300 w-full"
          >
            Choose Store
            <svg
              className={clsx(
                "ml-2 h-4 w-4 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown menu */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-2">
                  {purchaseLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
