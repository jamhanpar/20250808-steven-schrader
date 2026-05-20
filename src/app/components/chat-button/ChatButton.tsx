"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useAudioPlayer } from "../audio-player-provider/AudioPlayerProvider";
import "./ChatButton.css";

// Approximate height of the audio player bar + a small gap
const PLAYER_HEIGHT = 80;
const PLAYER_GAP = 12;

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
  const { isPlayerVisible } = useAudioPlayer();

  // Match the responsive bottom offsets from the original CSS
  const [baseBottom, setBaseBottom] = useState(32);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(max-width: 480px)").matches) setBaseBottom(8);
      else if (window.matchMedia("(max-width: 768px)").matches)
        setBaseBottom(16);
      else setBaseBottom(32);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const bottomValue = isPlayerVisible
    ? baseBottom + PLAYER_HEIGHT + PLAYER_GAP
    : baseBottom;

  if (!isVisible) return null;

  return (
    <motion.div
      // Tailwind handles responsive `right`; Framer Motion handles animated `bottom`
      className="fixed right-2 sm:right-4 lg:right-8 z-[999]"
      animate={{ bottom: bottomValue }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
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
    </motion.div>
  );
}
