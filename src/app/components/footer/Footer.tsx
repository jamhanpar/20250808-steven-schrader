import React from "react";
import clsx from "clsx";
import "./Footer.css";

interface FooterProps {
  classname?: string;
}

const Footer: React.FC<FooterProps> = ({ classname }) => {
  return (
    <footer
      className={clsx(
        "footer",
        classname,
        "w-full h-fit bg-background text-primary text-sm py-4 flex flex-row gap-2 items-center justify-center"
      )}
    >
      <span className="mb-1">
        &copy; {new Date().getFullYear()} Steven Schrader
      </span>
      <span className="text-xs">All rights reserved.</span>
    </footer>
  );
};

export default Footer;
