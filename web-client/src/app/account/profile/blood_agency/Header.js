"use client";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useCredentials } from "@/context/CredentialsContext";
import { User2Icon } from "lucide-react";

// Skeleton component
function Skeleton({ className }) {
  return (
    <div
      className={`bg-gray-300 dark:bg-gray-600 animate-pulse ${className}`}
    />
  );
}

function InfoCard({ icon, value, label, loading, delay }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 py-3 px-5 shadow-md bg-gray-800  rounded-2xl  dark:shadow-none"
    >
      {loading ? (
        <Skeleton className="w-10 h-10 rounded-full" />
      ) : (
        <div>{icon}</div>
      )}
      <div>
        {loading ? (
          <>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </>
        ) : (
          <>
            <Typography className="font-bold font-ElMessiri text-base sm:text-lg md:text-xl dark:text-gray-300">
              {value}
            </Typography>
            <Typography className="font-medium font-ElMessiri text-xs sm:text-sm md:text-base dark:text-gray-400">
              {label}
            </Typography>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Header() {
  const { user, updateUser, loading } = useCredentials();
  const API_URL = process.env.NEXT_PUBLIC_API_UPLOADS_URL;
  const avatarRef = useRef();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    `${API_URL}/${user.photo}`
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  useEffect(() => {
    const updateAvatar = async () => {
      const formData = new FormData();
      avatarFile && formData.append("file", avatarFile);
      await updateUser(formData);
    };
    updateAvatar();
  }, [avatarFile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const avatarVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 sm:p-8 lg:p-10 rounded-lg shadow-sm dark:from-gray-700 dark:to-gray-800"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
        <motion.div variants={avatarVariants} className="relative">
          {loading ? (
            <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full" />
          ) : (
            <>
              <Button variant="text" onClick={() => avatarRef.current.click()}>
                {user.photo ? (
                  <Avatar
                    src={avatarPreview}
                    className="w-28 h-28 sm:w-32 sm:h-32 md:w-64 md:h-64 cursor-pointer"
                  />
                ) : (
                  <User2Icon size={64} color="teal" />
                )}
              </Button>
              <input
                ref={avatarRef}
                id="avatarInput"
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </>
          )}
        </motion.div>
        <div className="flex flex-col gap-3">
          {loading ? (
            <>
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </>
          ) : (
            <motion.div variants={avatarVariants}>
              <Typography
                variant="h3"
                className=" text-xl :text-3xl dark:text-gray-300"
              >
                {user.name}
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                <div>
                  <Typography className="text-sm sm:text-base md:text-lg font-ElMessiri ">
                    المستخدم
                  </Typography>
                  <Typography className="text-base sm:text-lg md:text-xl font-bold  font-ElMessiri ">
                    وكالة التبرع بالدم
                  </Typography>
                </div>
                <div>
                  <Typography className="text-sm sm:text-base md:text-lg font-ElMessiri ">
                    رقم الهاتف
                  </Typography>
                  <Typography className="text-base sm:text-lg md:text-xl font-bold  font-ElMessiri ">
                    {user.phone}
                  </Typography>
                </div>
                <div>
                  <Typography className="text-sm sm:text-base md:text-lg font-ElMessiri ">
                    البريد الالكتروني
                  </Typography>
                  <Typography className="text-base sm:text-lg md:text-xl font-bold  font-ElMessiri ">
                    {user.email}
                  </Typography>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Header;
