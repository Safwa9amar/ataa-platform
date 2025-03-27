"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { OppertunitiesTable } from "./OppertunitiesTable";
import { getCharityById } from "@/services/charityService";
import { useCredentials } from "@/context/CredentialsContext";
import { notFound } from "next/navigation";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { Spinner } from "@material-tailwind/react";

export default function page({ params }) {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const charityID = params.id;

  const getChrityData = async () => {
    try {
      let data = await getCharityById(charityID, userToken);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChrityData();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Spinner width={50} height={50} color="green" />
      </div>
    );
  if (data.length === 0) return notFound();

  return (
    <div className="flex items-stretch flex-col gap-2 md:gap-5">
      {/* Animation wrapped for the entire container */}
      <motion.div
        className="bg-mangoBlack bg-charityBg mx-5 bg-cover bg-fixed bg-opacity-75 border-borderColor border-2 rounded-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gray-900 bg-opacity-55 flex flex-col gap-2 items-center justify-between p-5">
          {/* Image animation */}
          <motion.div
            className="rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              className="rounded-full"
              src={
                "https://yt3.googleusercontent.com/Pa2-k-4xmCmnrrE0lmmcCMHBjwVk8vNh1nsNYKYplfLNjputxJJeZeMlOhPNW_PA0W33IrirYg=s900-c-k-c0x00ffffff-no-rj"
              }
              width={200}
              height={200}
              alt="Charity Image"
            />
          </motion.div>
          {/* Text animation */}
          <motion.p
            className="md:text-2xl text-[#fff]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {data.legalName}
          </motion.p>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-between mx-5 ">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <StatCard
            number={2222}
            title={"اجمالي التبرعات"}
            icon={<IoStatsChartSharp />}
          />
        </motion.div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatCard
            number={2222}
            title={"عدد الفرص"}
            icon={<FaHandHoldingHeart />}
          />
        </motion.div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatCard
            number={2222}
            title={"عدد المستفيدين"}
            icon={<FaPeopleGroup size={22} />}
          />
        </motion.div>
      </div>
      {/* Add animation to OppertunitiesTable */}
      <motion.div
        className="opacity-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <OppertunitiesTable data={data} />
      </motion.div>
    </div>
  );
}

const StatCard = ({ number, title, icon }) => {
  return (
    <motion.div
      className="bg-mangoBlack shadow-inner hover:shadow-md flex-1 border-2 border-borderColor rounded-md p-5 flex flex-col justify-center items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <span className="text-2xl font-ReemKufi">{number}</span>
      <span className="flex gap-2 items-center">
        <p>{title}</p>
        {icon}
      </span>
    </motion.div>
  );
};
