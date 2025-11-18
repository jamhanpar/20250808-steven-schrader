"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import "./ChatButton.css";

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
  isVisible?: boolean;
}

export default function ChatButton({
  onClick,
  className = "",
  isVisible = true,
}: ChatButtonProps) {
  if (!isVisible) return null;

  return (
    <motion.button
      className={clsx("chat-button", className)}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 8px 32px rgba(227, 112, 68, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open contact form"
    >
      <motion.div
        className="chat-button__pulse"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.svg
        className="chat-button__icon"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ rotate: 0 }}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        <motion.path
          d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.path
          d="M22 6L12 13L2 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
        />
      </motion.svg>

      {/* Tooltip */}
      <div className="chat-button__tooltip">Get in touch</div>
    </motion.button>
  );
}
