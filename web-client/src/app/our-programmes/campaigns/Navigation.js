"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/UI/Button";
import SearchWithMenu from "@/components/UI/SearchWithMenu";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FaPlusCircle,
  FaCheckCircle,
  FaClock,
  FaPlayCircle,
  FaUsers,
} from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";
const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 3 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 2 },
};

const navLinks = [
  {
    label: "",
    href: "/our-programmes/campaigns",
    icon: <MdCampaign size={18} />,
  },
  {
    label: "حملات المستخدمين",
    href: "/our-programmes/campaigns/users-campaigns",
    icon: <FaUsers />,
  },
  {
    label: "انشاء حملة",
    href: "/our-programmes/campaigns/create",
    icon: <FaPlusCircle />,
  },
  {
    label: "حملاتي النشطة",
    href: "/our-programmes/campaigns/my-campaigns",
    queryKey: "isAgreed",
    queryValue: "true",
    icon: <FaPlayCircle />,
  },
  {
    label: "حملاتي المعلقة",
    href: "/our-programmes/campaigns/my-campaigns",
    queryKey: "isAgreed",
    queryValue: "false",
    icon: <FaClock />,
  },
  {
    label: "حملاتي المكتملة",
    href: "/our-programmes/campaigns/my-campaigns/completed",
    icon: <FaCheckCircle />,
  },
];

const campaignTypes = [
  { status: "all", ar_status: "الكل", color: "black" },
  { status: "URGENT", ar_status: "مستعجلة", color: "red" },
  { status: "NOT_URGENT", ar_status: "غير مستعجلة", color: "green" },
  { status: "ONGOING", ar_status: "صدقة جارية", color: "blue" },
];

export default function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("status") || "all"
  );
  const [keywords, setKeywords] = useState(searchParams.get("keywords") || "");
  const isAgreed = searchParams.get("isAgreed") === "true";

  const isMobile = useMediaQuery({ maxWidth: 600 });

  const isActive = (path, queryKey, queryValue) => {
    const currentQueryValue = searchParams.get(queryKey);
    return pathname === path && (!queryKey || currentQueryValue === queryValue);
  };

  useEffect(() => {
    router.push(
      `${pathname}?keywords=${keywords}&status=${activeTab}${
        searchParams.get("isAgreed") ? "&isAgreed=" + isAgreed : ""
      }`
    );
  }, [keywords, activeTab]);

  const NavButton = ({ label, href, queryKey, queryValue, icon }) => (
    <Link href={href + (queryKey ? `?${queryKey}=${queryValue}` : "")} passHref>
      <Button
        variant="filled"
        className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all text-textColor font-ElMessiri text-sm ${
          isActive(href, queryKey, queryValue)
            ? "bg-green-500 text-white shadow-lg"
            : "bg-gray-300 hover:bg-gray-400 text-black"
        }`}
      >
        {icon} {label}
      </Button>
    </Link>
  );

  return (
    <div className="sticky top-0 z-50 w-full h-fit mb-6 p-6 bg-nav_bg rounded-lg shadow-md grid md:grid-cols-[1fr_2fr] place-items-center gap-10 items-center justify-between overflow-x-auto">
      <SearchWithMenu
        menuItems={campaignTypes.map((item) => item.ar_status)}
        onMenuItemClick={(item) => {
          const selectedCampaign = campaignTypes.find(
            (cam) => cam.ar_status === item
          );
          setActiveTab(selectedCampaign?.status);
        }}
        placeholder="البحث بعنوان الحملة او الوصف"
        onInputChange={setKeywords}
      />
      <Carousel
        swipeable
        draggable
        responsive={responsive}
        ssr={true}
        rtl
        keyBoardControl={true}
        itemClass="max-w-fit mx-3"
        transitionDuration={500}
        containerClass="w-full h-fit"
      >
        {navLinks.map((link) => (
          <NavButton key={link.href + (link.queryValue || "")} {...link} />
        ))}
      </Carousel>
    </div>
  );
}
