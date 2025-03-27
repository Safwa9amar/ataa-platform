import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "@material-tailwind/react";

const HoverCard = ({
  title = "",
  desciption = "",
  href = "",
  variant = "h2",
}) => {
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth);
    }
  }, []);

  const handOffset = cardWidth / 4; // تحديد المسافة بناءً على عرض البطاقة

  return (
    <motion.div
      ref={cardRef}
      className="text-center h-fit w-96 p-5 overflow-hidden cursor-pointer"
      whileHover="hover"
    >
      <Link href={href}>
        <div className="relative min-h-10 flex items-center justify-center">
          {/* Left Hand */}
          <motion.img
            src="/images/left-hand.svg"
            alt="Left Hand"
            className="absolute left-[30%] h-5"
            variants={{
              hover: { x: -handOffset },
            }}
            initial={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          />
          {/* Title and Description */}
          <motion.div
            className="absolute z-0 text-center opacity-0"
            variants={{
              hover: { opacity: 1 },
            }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant={variant}
              className="font-bold text-gray-800 dark:text-gray-300"
            >
              {title}
            </Typography>
          </motion.div>
          {/* Right Hand */}
          <motion.img
            src="/images/right-hand.svg"
            alt="Right Hand"
            className="absolute right-[30%] h-5"
            variants={{
              hover: { x: handOffset },
            }}
            initial={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
        <p className="text-gray-600 dark:text-gray-200 mt-2">{desciption}</p>
      </Link>
    </motion.div>
  );
};

export default HoverCard;
