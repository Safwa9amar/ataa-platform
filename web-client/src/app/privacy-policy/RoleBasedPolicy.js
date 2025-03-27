"use client";
import React, { useState } from "react";
import { Typography, Collapse, Button } from "@material-tailwind/react"; // Import Material Tailwind Collapse and Typography components
import { BiChevronDownCircle } from "react-icons/bi";
import { useCredentials } from "@/context/CredentialsContext";
import dynamic from "next/dynamic";
import userPolicy from "./userPolicy";
import charityPolicy from "./charityPolicy";
import partnerPolicy from "./partnerPolicy";
import bloodAgencyPolicy from "./bloodAgencyPolicy";

export default function PrivacyPolicy() {
  const { user } = useCredentials();

  const [openIndex, setOpenIndex] = useState(null); // Track which item is open
  const data = React.useMemo(() => {
    switch (user.role) {
      case "donor":
        return userPolicy;
      case "charity":
        return charityPolicy;
      case "partner":
        return partnerPolicy;
      case "blood_agency":
        return bloodAgencyPolicy;
      default:
        return userPolicy;
    }
  }, [user.role]);
   data;

  // Toggle collapse state based on item index
  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return data.map((item, index) => (
    <div key={index} className="mb-6 w-full max-w-3xl">
      <Button
        variant="outlined"
        color="teal"
        onClick={() => toggleCollapse(index)} // Toggle collapse for the clicked item
        className="
             w-full text-lg text-right flex justify-between items-center font-ElMessiri 
             p-5 bg-gray-100 dark:bg-teal-700 border rounded-lg shadow-md 
             hover:bg-teal-200 dark:hover:bg-teal-800 transition-all duration-300
           "
      >
        <span className="text-right dark:text-teal-200">{item.title}</span>
        <BiChevronDownCircle
          size={26}
          className={`transition-transform duration-300 dark:fill-teal-200 ${
            openIndex === index ? "rotate-180" : ""
          }`}
        />
      </Button>

      <Collapse open={openIndex === index}>
        <Typography className="p-6 text-lg text-gray-700 dark:text-gray-200 font-ElMessiri bg-gray-50 dark:bg-gray-700 border-t-2 border-borderColor rounded-b-lg mt-2">
          {item.description}
        </Typography>
      </Collapse>
    </div>
  ));
}
