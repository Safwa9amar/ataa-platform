"use client";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar"; // For circular progress in web
import "react-circular-progressbar/dist/styles.css"; // Import styles for circular progress
import EducationSvg from "@/components/vectors/EducationSvg";
import SocialSvg from "@/components/vectors/SocialSvg";
import HealthSvg from "@/components/vectors/HealthSvg";
import FoodSvg from "@/components/vectors/FoodSvg";
import AccommodationSvg from "@/components/vectors/AccommodationSvg";
import ReligiousSvg from "@/components/vectors/ReligiousSvg";
import { FaCircleInfo } from "react-icons/fa6";
import { Button, Tooltip } from "@material-tailwind/react";

const data = [
  {
    icon: <EducationSvg />,
    title: "تعليم",
    value: "300",
    rating: 20,
    color: "#4CAF50",
  },
  {
    icon: <SocialSvg />,
    title: "اجتماعي",
    value: "100",
    rating: 10,
    color: "#6D00F7",
  },
  {
    icon: <HealthSvg />,
    title: "صحي",
    value: "100",
    rating: 13,
    color: "#0FA755",
  },
  {
    icon: <FoodSvg />,
    title: "عذائي",
    value: "100",
    rating: 18,
    color: "#EB8308",
  },
  {
    icon: <AccommodationSvg />,
    title: "الاسكان",
    value: "100",
    rating: 25,
    color: "#D908EB",
  },
  {
    icon: <ReligiousSvg />,
    title: "ديني",
    value: "100",
    rating: 32,
    color: "#EB0867",
  },
];
export default function RenderCards() {
  return (
    <div
      className="grid  md:grid-cols-3 place-items-center gap-1 md:gap-5"
      dir="rtl"
    >
      {data.map((item, index) => (
        <StatisticCard
          key={index}
          icon={item.icon}
          title={item.title}
          value={item.value}
          rating={item.rating}
          color={item.color}
        />
      ))}
    </div>
  );
}
function StatisticCard({ title, value, icon, color, rating }) {
  return (
    <div className="flex items-center  group">
      {/* Card */}
      <div className="flex items-center justify-between w-full md:max-w-80 bg-mangoBlack border border-borderColor rounded-lg p-5 m-4 shadow-lg">
        <div className="flex flex-col text-right">
          <div className="flex items-center space-x-4">
            {icon && <div>{icon}</div>}
            <p className="text-lg font-bold" style={{ color }}>
              {title}
            </p>
          </div>
          <p className="text-sm text-gray-600">عدد المستفيدن</p>
          <p className="text-sm text-gray-600">{value} مستفيد</p>
        </div>
        <div className="relative">
          <div className="w-24 h-24">
            {/* Placeholder for image */}
            <CircularProgressbar
              className="scale-75"
              value={rating}
              text={`${rating}%`}
              styles={{
                path: { stroke: color },
                text: { fill: color, fontSize: "16px", fontWeight: "bold" },
              }}
            />
          </div>
        </div>
      </div>

      {/* Hidden content that appears on hover */}
      <div className="opacity-0 translate-x-20 -z-10 bg-mangoBlack p-5 rounded-md group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <p className="text-xs">ويشمل : </p>
        <ul className="list-disc px-2 text-xs">
          <li>الاطعام</li>
          <li>السقي</li>
          <li>الاضاحي</li>
        </ul>
      </div>
    </div>
  );
}
