"use client";

import { motion } from "framer-motion";
import "./Loading.css";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  showText?: boolean;
}

export default function Loading({
  size = "md",
  className = "",
  text = "Loading...",
  showText = true,
}: LoadingProps) {
  const sizeClasses = {
    sm: "loading--sm",
    md: "loading--md",
    lg: "loading--lg",
  };

  return (
    <div className={`loading ${sizeClasses[size]} ${className}`}>
      <motion.div
        className="loading__spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          className="loading__icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60 20"
            initial={{ strokeDasharray: "0 80" }}
            animate={{ strokeDasharray: ["0 80", "60 20", "0 80"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {showText && (
        <motion.p
          className="loading__text"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
