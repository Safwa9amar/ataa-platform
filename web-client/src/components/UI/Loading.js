"use client";
import Image from "next/image";
import React from "react";

export default function UILoading({ height = "h-[500px]" }) {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="relative flex flex-col items-center">
        <Image
          alt="logo"
          className="absolute w-16 h-16"
          width={200}
          height={200}
          src={"/logo/logoWithCircle.png"}
        />
        <div className="w-16 h-16 rounded-full border-4 border-r-primaryColor dark:border-r-primaryColorDark animate-spin"></div>
      </div>
    </div>
  );
}
