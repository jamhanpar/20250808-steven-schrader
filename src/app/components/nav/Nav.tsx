"use client";

import React, { useState } from "react";
import clsx from "clsx";
import "./Nav.css";
import Link from "next/link";
import navLinks from "./nav.json";

interface NavProps {
  classname?: string;
}

const Nav: React.FC<NavProps> = ({ classname }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={clsx(
        "nav",
        classname,
        "flex justify-center w-full sticky top-0 left-0 z-50 bg-background h-fit"
      )}
    >
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-4xl font-bold text-primary">
              Steven Schrader
            </span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex md:gap-8 space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium transition-colors text-primary hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            style={{ color: "var(--jp-color-text)" }}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Blurred overlay */}
          <div
            className="absolute inset-0 bg-[var(--jp-color-surface)]/60 backdrop-blur-md transition-all duration-300"
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu links */}
          <div
            className="relative flex flex-col items-center justify-center h-full w-full gap-8"
            onClick={() => setMenuOpen(false)}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-semibold px-6 py-4 rounded-md transition-colors text-center w-full z-10"
                style={{ color: "var(--jp-color-text)" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent closing when clicking a link
                  setMenuOpen(false);
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--jp-color-primary)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--jp-color-text)")
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
