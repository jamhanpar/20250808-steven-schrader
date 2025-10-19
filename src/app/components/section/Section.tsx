import React from "react";
import clsx from "clsx";

interface SectionProps {
  children: React.ReactNode;
  classname?: string;
}

const Section: React.FC<SectionProps> = ({ children, classname }) => (
  <section
    className={clsx(
      `bg-background w-full flex justify-center md:max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 lg:py-16`,
      classname
    )}
  >
    {children}
  </section>
);

export default Section;
