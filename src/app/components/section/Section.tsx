import React from "react";
import clsx from "clsx";

interface SectionProps {
  children: React.ReactNode;
  classname?: string;
  title?: string;
  subtitle?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  classname,
  title,
  subtitle,
}) => (
  <section
    className={clsx(
      `bg-background w-full flex flex-col gap-10 justify-center md:max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 lg:py-16`,
      classname
    )}
  >
    {(title || subtitle) && (
      <div className="text-center mb-8">
        {title && (
          <h3 className="mb-6 text-2xl font-medium tracking-widest text-primary uppercase lg:mb-8">
            {title}
          </h3>
        )}
        {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

export default Section;
