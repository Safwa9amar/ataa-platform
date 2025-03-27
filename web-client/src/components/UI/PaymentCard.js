"use client";
import React from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Button } from "@material-tailwind/react";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";
const mySwal = withReactContent(Swal);
function PaymentCard({ plan }) {
  const handleShowMore = () => {
    mySwal.fire({
      html: (
        <div className="flex flex-col items-center" dir="rtl">
          <img className="h-[200px] w-[300px]" src="/logo/fullLogo.png" />
          <h2
            className={`mt-5 text-2xl text-white text-center font-semibold mb-4`}
          >
            {plan.title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {plan.description}
          </p>
          <ul className="list-disc text-right p-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
            {plan.features.map((feature, i) => (
              <li
                className="hover:bg-gray-600 hover:text-white px-2 bg-opacity-45 rounded-lg"
                key={i}
              >
                {feature.title}
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
          className={`text-2xl text-right font-semibold mb-4 text-teal-600 dark:text-teal-400`}
        >
          {plan.title}
        </h2>

        <div className="ml-4 mt-2 flex items-baseline gap-1.5 ">
          <div className="relative">
            <div className="flex items-baseline gap-1.5">
              <p
                className={`md:text-[3rem] text-right font-semibold mb-4 `}
                data-testid="plus-pricing-column-cost"
              >
                {plan.price}
              </p>
              <div className="flex flex-col items-start justify-center">
                <p
                  className="absolute mb-6 text-xs text-token-text-tertiary"
                  data-testid="plus-pricing-column-cost"
                >
                  دج/
                </p>
                <p
                  className="text-sm text-token-text-tertiary"
                  data-testid="plus-pricing-column-cost"
                >
                  سنة
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-lg ">{plan.description}</p>
        <Button
          variant="text"
          color="teal"
          className="mb-6 text-md p-2 font-ElMessiri hover:text-teal-600 dark:hover:text-teal-700 transition-colors duration-300"
          onClick={handleShowMore}
        >
          عرض مزايا الباقة
        </Button>
      </div>
      <motion.a
        href={plan.paymentLink}
        className="w-full bg-teal-500 text-white text-center text-md py-2 px-6 rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors duration-300"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          scale: 1.05, // Scale up slightly on hover
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Add shadow on hover
        }}
        whileTap={{ scale: 0.98 }} // Slightly scale down on tap/click
      >
        اشترك الآن
      </motion.a>
    </>
  );
}

export default PaymentCard;
