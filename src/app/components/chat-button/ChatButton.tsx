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
          d="M8 10H16M8 14H12M21 12C21 16.9706 16.9706 21 12 21C10.2305 21 8.58073 20.4826 7.2188 19.6045L3 21L4.3955 16.7812C3.51743 15.4193 3 13.7695 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </motion.svg>

      {/* Tooltip */}
      <div className="chat-button__tooltip">Get in touch</div>
    </motion.button>
  );
}
