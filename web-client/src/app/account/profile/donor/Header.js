"use client";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useCredentials } from "@/context/CredentialsContext";
import Image from "next/image";
import RankIcons from "@/components/UI/RankIcons";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BiSolidDonateBlood } from "react-icons/bi";
import Swal from "sweetalert2";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-300 dark:bg-gray-600 animate-pulse ${className}`} />
);

const InfoCard = ({ icon, value, label, loading, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 py-3 px-5 shadow-md bg-gray-800 text-white rounded-2xl dark:bg-gray-900 dark:shadow-none"
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
            <Typography className="font-bold text-lg dark:text-gray-300">
              {value}
            </Typography>
            <Typography className="text-sm dark:text-gray-400">
              {label}
            </Typography>
          </>
        )}
      </div>
    </motion.div>
  );
};

const Header = () => {
  const { user, updateUser, loading, isLoggedIn } = useCredentials();
  const API_URL = process.env.NEXT_PUBLIC_API_UPLOADS_URL;
  const avatarRef = useRef();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.photo ? `${API_URL}/${user.photo}` : "/logo/fullLogo.png"
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image") && file.size <= 5 * 1024 * 1024) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      Swal.fire("خطأ", "يجب أن يكون الملف صورة وأقل من 5MB!", "error");
    }
  };

  useEffect(() => {
    if (!avatarFile) return;
    const updateAvatar = async () => {
      try {
        const formData = new FormData();
        formData.append("file", avatarFile);
        await updateUser(formData);
      } catch (error) {
        Swal.fire("خطأ", "فشل تحديث الصورة!", "error");
      }
    };
    updateAvatar();
  }, [avatarFile]);

  if (!isLoggedIn) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.3 }}
      className="p-6 rounded-lg bg-gradient-to-br from-primaryColor to-secondaryColor dark:from-teal-700/40 dark:to-teal-800/35"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <Skeleton className="w-28 h-28 rounded-full" />
          ) : (
            <>
              <Button variant="text" onClick={() => avatarRef.current.click()}>
                <Avatar
                  src={avatarPreview}
                  className="w-28 h-28 cursor-pointer"
                />
              </Button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          )}
        </motion.div>
        <div className="flex flex-col gap-3">
          {loading ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <motion.div>
              <Typography
                variant="h3"
                className="text-white text-xl dark:text-gray-300"
              >
                {user.name}
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {["المستخدم", "رقم الهاتف", "البريد الالكتروني"].map(
                  (label, idx) => (
                    <div key={idx}>
                      <Typography className="text-sm dark:text-gray-500">
                        {label}
                      </Typography>
                      <Typography className="text-base font-bold text-white dark:text-gray-300">
                        {[user.role, user.phone, user.email][idx]}
                      </Typography>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        {[
          {
            icon: (
              <Image
                width={60}
                height={60}
                src="/icons/Frame208.png"
                alt="Rank"
              />
            ),
            value: user.sharedLinks.reduce(
              (acc, curr) => acc + curr.ambassadorPoints,
              0
            ),
            label: "نقاطك المشاركة في سفراء عطاء",
            delay: 0.1,
          },
          {
            icon: (
              <Image
                width={60}
                height={60}
                src="/icons/Frame208.png"
                alt="Rank"
              />
            ),
            value: user.ambassadorPoints.reduce(
              (acc, curr) => acc + curr.totalPoints,
              0
            ),
            label: "نقاط التبرع في سفراء عطاء",
            delay: 0.1,
          },
          {
            icon: <RankIcons size={30} rank={user.topDonorRank} />,
            value: `${user.totalDonatedAmount?.toFixed(2)} د.ج`,
            label: "المبلغ المتبرع به",
            delay: 0.2,
          },
          {
            icon: <MdAccountBalanceWallet size={40} />,
            value: `${user.currentBalance?.toFixed(2)} د.ج`,
            label: "الرصيد الحالي",
            delay: 0.3,
          },
          {
            icon: <BiSolidDonateBlood size={40} />,
            value: user.numberOfDonations,
            label: "عدد التبرعات",
            delay: 0.4,
          },
        ].map((props, idx) => (
          <InfoCard key={idx} {...props} loading={loading} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Header;
