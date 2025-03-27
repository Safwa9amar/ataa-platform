"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
// Import icons from react-icons
import { IoIosHeart } from "react-icons/io"; // Example Ionicons
import { FaStar, FaHeart } from "react-icons/fa"; // Example FontAwesome
import { MdFavorite } from "react-icons/md"; // Example MaterialIcons
import { FiHeart } from "react-icons/fi"; // Example Fontisto
import { TrashIcon } from "@heroicons/react/24/solid";

const AnimatedCampaignsCard = ({
  item,
  index,
  onClick,
  image,
  label,
  description,
  children,
}) => {
  const { theme } = useTheme();

  // Framer Motion animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      key={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger animations for multiple cards
    >
      <CampaignsCard
        onClick={onClick}
        image={image}
        label={label}
        description={description}
      >
        {children}
      </CampaignsCard>
    </motion.div>
  );
};

const CampaignsCard = ({ onClick, image, label, description, children }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-row  dark:hover:text-gray-800 justify-between border border-borderColor bg-mangoBlack rounded-lg p-4 cursor-pointer hover:bg-primaryColor transition-all`}
    >
      {/* Image Section */}
      {image && (
        <Image
          src={image.src || "/logo/fullLogo.png"} // Add fallback image
          alt={label}
          width={70}
          height={70}
          className="rounded-lg"
        />
      )}

      {/* Content Section */}
      <div className="flex flex-col gap-2 flex-1 px-4">
        {/* Title and Icon Row */}
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-semibold w-52">{label}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 w-72 truncate">{description}</p>
      </div>

      {/* Children */}
      {children}
    </div>
  );
};

export default AnimatedCampaignsCard;
