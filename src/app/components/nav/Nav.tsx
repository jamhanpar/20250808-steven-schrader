"use client";

import React, { useState } from "react";
import clsx from "clsx";
import "./Nav.css";
import Link from "next/link";
import navLinks from "./nav.json";
import { usePathname } from "next/navigation";

interface NavProps {
  classname?: string;
}

const Nav: React.FC<NavProps> = ({ classname }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState<boolean | null>(null);
  const pathname = usePathname();

  return (
    <header
      className={clsx(
        "nav",
        "flex justify-center w-full bg-background h-fit",
        classname
      )}
    >
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-4xl font-bold text-primary hover:text-primary-hover drop-shadow-lg">
              Steven Schrader
            </span>
          </Link>
        </div>
        {/* Desktop Nav w/ Dropdowns */}
        {/* <div className="hidden md:flex md:gap-8 space-x-8">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  className={clsx(
                    "text-lg font-medium transition-colors duration-300 text-primary drop-shadow-lg hover:text-primary-hover flex items-center",
                    pathname === link.href &&
                      "text-accent border-b-2 border-accent"
                  )}
                >
                  {link.name}
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md z-20 overflow-hidden">
                    {link.children.map((child: any) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-primary hover:bg-white hover:text-accent"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "text-lg font-medium transition-colors duration-300 text-primary drop-shadow-lg hover:text-primary-hover",
                  pathname === link.href &&
                    "text-accent border-b-2 border-accent"
                )}
              >
                {link.name}
              </Link>
            )
          )}
        </div> */}
        {/* Desktop Nav */}
        <div className="hidden md:flex md:gap-8 space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "text-lg font-medium transition-colors duration-300 text-primary drop-shadow-lg hover:text-primary-hover",
                pathname === link.href && "text-accent border-b-2 border-accent"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-primary inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
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
                className={clsx(
                  "text-accent text-2xl font-semibold px-6 py-4 rounded-md transition-colors text-center w-full z-10 hover:text-accent-hover",
                  pathname === link.href && "nav-active-mobile"
                )}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent closing when clicking a link
                  setMenuOpen(false);
                }}
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
