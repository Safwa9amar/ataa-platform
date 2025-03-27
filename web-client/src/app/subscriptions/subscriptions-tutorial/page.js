"use client";
import React from "react";
import { motion } from "framer-motion";
export default function page() {
  return (
    <motion.div
      className="relative w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/your-video-id"
        title="Tutorial Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </motion.div>
  );
}
