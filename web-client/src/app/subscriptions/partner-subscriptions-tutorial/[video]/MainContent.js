import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa6";
import Comments from "./Comments";
export default function MainContent() {
  return (
    <motion.main
      className="w-full flex-1 bg-mangoBlack p-4 md:p-6 rounded-lg shadow-md"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Section */}
      <motion.div
        id="tutorial1"
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center lg:text-right">
          الفيديو التعليمي
        </h2>
        <motion.div
          className="relative w-full h-48 md:h-96 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden"
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
      </motion.div>

      {/* Comments Section */}
      <Comments />
    </motion.main>
  );
}
