"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Link from "next/link";
import { Button, IconButton } from "@material-tailwind/react";
import { BiBus } from "react-icons/bi";
import { CiShare2 } from "react-icons/ci";
import { MdShare } from "react-icons/md";
import { useShare } from "@/context/ShareContext";
import { useCredentials } from "@/context/CredentialsContext";

const NationalBloodDonationCard = ({
  id,
  image,
  badgeColor,
  city = "الجزائر",
  title,
  remainingAmount,
  needyGroup = "A+",
  width = 300,
  customStyles = {},
}) => {
  const { user } = useCredentials();
  const fadeAnim = useRef(0);
  const translateYAnim = useRef(20);
  const { openShareModal } = useShare();

  useEffect(() => {
    fadeAnim.current = 1;
    translateYAnim.current = 0;
  }, []);

  return (
    <motion.div
      dir="rtl"
      className="relative rounded-lg border border-borderColor bg-blue-gray-50 dark:bg-blue-gray-800 overflow-hidden shadow-md min-w-[350px] h-[400px]"
      style={{
        margin: "10px auto",
        ...customStyles,
      }}
      initial={{ opacity: fadeAnim.current, y: translateYAnim.current }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Carousel */}
      <div className="relative w-full h-1/3 ">
        <img className="w-full h-full" src={image} />
        <div className="absolute -bottom-10 rounded-full left-1/2 -translate-x-1/2 bg-gray-700 dark:bg-gray-200 p-5">
          <BiBus className="fill-white dark:fill-black" size={50} />
        </div>
      </div>

      {/* Overlay */}
      <div className="w-full  p-5 text-right flex flex-col items-start gap-2 mt-10">
        {/* Title */}
        <p>{title}</p>

        <p>
          <strong className="text-gray-700 dark:text-gray-300">
            المنطقة :
          </strong>{" "}
          {city}
        </p>
        {/* Remaining Amount */}
        <p>
          <strong className="text-gray-700 dark:text-gray-300">
            اجمالي الوحدات المجموعة :
          </strong>{" "}
          {remainingAmount}
        </p>
        <p>
          <strong className="text-gray-700 dark:text-gray-300">
            الزمرة الأكثر احتياجا :
          </strong>{" "}
          {needyGroup}
        </p>

        <div className="flex gap-2">
          <Link
            href={`/our-programmes/campaign/national-blood?query=${id}&title=${title}`}
          >
            <Button className={`rounded-full font-ElMessiri bg-[#E63946]`}>
              ساهم في انقاذ حياة
            </Button>
          </Link>
          <IconButton
            onClick={() =>
              openShareModal({
                url:
                  window.location.host +
                  `/our-programmes/campaign/national-blood?query=${id}&title=${title}`,
                title: title,
                userId: user.id,
                type: "national-campaign",
                itemId: id,
              })
            }
            color="indigo"
          >
            <MdShare size={26} />
          </IconButton>
        </div>
      </div>
    </motion.div>
  );
};

NationalBloodDonationCard.propTypes = {
  id: PropTypes.number,
  image: PropTypes.string.isRequired,
  badgeColor: PropTypes.string,
  badgeTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  remainingAmount: PropTypes.string.isRequired,
  width: PropTypes.number,
  customStyles: PropTypes.object,
};

export default NationalBloodDonationCard;
