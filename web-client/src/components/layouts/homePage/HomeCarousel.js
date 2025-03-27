"use client";
import CONSTANTS from "@/config/constants";
import { useCredentials } from "@/context/CredentialsContext";
import { useTheme } from "@/context/ThemeContext";
import { Button, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaChevronLeft } from "react-icons/fa6";

export default function HomeCarousel() {
  const { user, isLoggedIn } = useCredentials();
  const { isDarkMode } = useTheme();
  return (
    <div
      dir="rtl"
      className={`grid grid-flow-dense w-full px-5 md:px-0 md:w-[95%] gap-4`}
    >
      {(user.role === CONSTANTS.USERS_ROLES.donor || !isLoggedIn) && (
        <div className="flex gap-5">
          <CardItem
            href="/major-benefactors"
            title={" كبار المحسنين"}
            iconSrc={
              isDarkMode ? "/icons/Frame209dark.png" : "/icons/Frame209.png"
            }
          />
          <CardItem
            href="/giving-ambassadors"
            title={"سفراء عطاء"}
            iconSrc={
              isDarkMode ? "/icons/Frame208dark.png" : "/icons/Frame208.png"
            }
          />
        </div>
      )}
      <div className="w-full flex flex-col md:flex-row gap-5">
        <CardItem
          href="/charity-partners"
          title={"شركاء الاحسان"}
          iconSrc={
            isDarkMode ? "/icons/Frame207dark.png" : "/icons/Frame207.png"
          }
        />
        <CardItem
          href="/charities"
          title={"الجمعيات الخيرية"}
          iconSrc={
            isDarkMode ? "/icons/Frame210dark.png" : "/icons/Frame210.png"
          }
        />
      </div>
    </div>
  );
}

const CardItem = ({ title, href = "#", iconSrc }) => {
  return (
    <Link
      href={href}
      className="w-full rounded-3xl overflow-hidden border-2 border-borderColor"
    >
      <div className="h-full w-full bg-teal-100 dark:bg-teal-600 rounded-lg bg-opacity-85 dark:bg-opacity-65 flex justify-between items-center   px-6 py-4  transition-transform transform hover:shadow-lg hover:scale-[1.02]">
        <span className="flex items-center">
          <Image
            width={200}
            height={200}
            className="w-10 h-10"
            src={iconSrc}
            alt={title}
          />
          <p variant="h5" className="text-center md:text-xl">
            {title}
          </p>
        </span>
        <FaChevronLeft color="black" />
      </div>
    </Link>
  );
};
