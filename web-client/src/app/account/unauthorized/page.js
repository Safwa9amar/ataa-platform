"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { RiHome2Line } from "react-icons/ri";
import { useCredentials } from "@/context/CredentialsContext";

export default function Unauthorized() {
  const { isLoggedIn } = useCredentials();
  return (
    <div
      className="min-h-[70vh] flex flex-col justify-center items-center "
      dir="rtl"
    >
      {/* Icon Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-red-500 mb-4"
      >
        <FaLock size={64} />
      </motion.div>

      {/* Heading Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-bold text-red-500"
      >
        الوصول مرفوض
      </motion.h1>

      {/* Description Animation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-4 text-gray-600 text-center"
      >
        ليس لديك إذن للوصول إلى هذه الصفحة.
      </motion.p>

      {/* Buttons Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        className="flex  gap-4 mt-6"
      >
        <Link
          href="/"
          className="px-6 py-1 flex items-center text-md  gap-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-700 transition"
        >
          <RiHome2Line color="white" />
          الرئيسية
        </Link>
        {!isLoggedIn && (
          <Link
            href="/account/login"
            className="px-6 py-1 bg-green-500 text-white rounded-full shadow hover:bg-green-700 transition"
          >
            تسجيل الدخول
          </Link>
        )}
      </motion.div>
    </div>
  );
}
