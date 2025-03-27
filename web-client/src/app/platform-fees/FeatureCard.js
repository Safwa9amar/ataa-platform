"use client";
import React from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Button } from "@material-tailwind/react";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";
const mySwal = withReactContent(Swal);
function FeatureCard({ title, description, features }) {
  const handleShowMore = () => {
    mySwal.fire({
      html: (
        <div className="flex flex-col items-center" dir="rtl">
          <img className="h-[200px] w-[300px]" src="/logo/fullLogo.png" />
          <h2
            className={`mt-5 text-2xl text-white text-center font-semibold mb-4`}
          >
            {title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {description}
          </p>
          <ul className="list-disc text-right p-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
            {features.map((feature, i) => (
              <li
                className="hover:bg-gray-600 hover:text-white px-2 bg-opacity-45 rounded-lg"
                key={i}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ),
      confirmButtonText: "حسنًا",
      showCloseButton: true,
      showConfirmButton: true,
      showCancelButton: false,
      focusConfirm: false,
      customClass: {
        popup: "bg-mangoBlack",
      },
    });
  };
  return (
    <>
      <div>
        <h2
          className={`text-xl text-right font-semibold mb-4 text-teal-600 dark:text-teal-400`}
        >
          {title}
        </h2>

        <p className="text-md">{description}</p>
        <Button
          variant="text"
          color="teal"
          className="mb-6 text-sm p-2 font-ElMessiri hover:text-teal-600 dark:hover:text-teal-700 transition-colors duration-300"
          onClick={handleShowMore}
        >
          المزيد من التفاصيل
        </Button>
      </div>
    </>
  );
}

export default FeatureCard;
