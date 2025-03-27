// Tabs.js
"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/solid";
import { BiCheckCircle } from "react-icons/bi";

export default function Tabs({ tabsData, curentTab }) {
  const queryParams = useSearchParams();
  const query = queryParams.get("query");
  return (
    <>
      {tabsData.data.map((tab) => (
        <Link
          className={`${
            tab.name === query
              ? "bg-teal-700 text-white"
              : "bg-teal-300 text-white"
          }  px-5 p-2 rounded-full text-sm flex items-center gap-2 text-center focus:scale-95 transition-transform`}
          key={tab.name}
          href={`/donation-opportunities/${curentTab}?query=${tab.name}`}
        >
          {tab.icon}
          {tab.label}
        </Link>
      ))}
      <Link
        className={`${
          "completed" === query
            ? "bg-teal-700 text-white"
            : "bg-teal-300 text-white"
        }  px-5 p-2 rounded-full text-sm flex gap-2 items-center text-center focus:scale-95 transition-transform`}
        key={"completed"}
        href={`/donation-opportunities/${curentTab}?query=completed&&progress=100`}
      >
        <BiCheckCircle size={20} />
        الفرص المكتملة
      </Link>
    </>
  );
}
