"use client";

import React, { useState } from "react";
import clsx from "clsx";
import "./Nav.css";
import Link from "next/link";
import navLinks from "../../data/nav.json";
import { usePathname } from "next/navigation";
import { useContactModal } from "../contact-modal-provider/ContactModalProvider";

interface NavProps {
  classname?: string;
}

interface NavLink {
  name: string;
  href: string;
  children?: {
    id: string;
    title: string;
    href: string;
  }[];
}

const Nav: React.FC<NavProps> = ({ classname }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState<boolean | null>(null);
  const pathname = usePathname();
  const { openContactModal } = useContactModal();

  const handleNavLinkClick = (link: NavLink, e: React.MouseEvent) => {
    if (link.name === "Contact") {
      e.preventDefault();
      openContactModal();
      if (menuOpen) setMenuOpen(false); // Close mobile menu if open
    }
  };

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
            <span className="text-3xl font-bold text-primary hover:text-primary-hover drop-shadow-lg">
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
              onClick={(e) => handleNavLinkClick(link, e)}
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
            onClick={() => {
              console.log("Hamburger clicked, current menuOpen:", menuOpen);
              setMenuOpen(!menuOpen);
            }}
            className="text-primary inline-flex items-center justify-center p-2 rounded-md focus:outline-none hover:bg-white/10 active:scale-95 touch-action-manipulation"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            type="button"
          >
            <svg
              className="h-6 w-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
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
          {/* Enhanced dark overlay - this will handle clicks */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => {
              console.log("Overlay clicked - closing menu");
              setMenuOpen(false);
            }}
          />

          {/* Menu links container - positioned absolutely to not interfere with overlay clicks */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 py-16 pointer-events-none">
            <div className="flex flex-col gap-4 w-full max-w-sm pointer-events-auto">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className={clsx(
                      "w-full text-white text-xl font-semibold px-6 py-4 rounded-xl transition-all duration-200 text-center min-h-[56px] flex items-center justify-center",
                      "bg-white/10 backdrop-blur-sm border border-white/20",
                      "hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95",
                      "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
                      pathname === link.href &&
                        "bg-[var(--jp-color-accent)]/90 border-[var(--jp-color-accent)] text-white ring-2 ring-[var(--jp-color-accent)]/50"
                    )}
                    onClick={(e) => {
                      console.log("Menu item clicked:", link.name);
                      handleNavLinkClick(link, e);
                      if (link.name !== "Contact") {
                        setMenuOpen(false);
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
