"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Button, Avatar } from "@material-tailwind/react";
import CONSTANTS from "@/config/constants";
import { FaClipboardList, FaExternalLinkSquareAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import UILoading from "@/components/UI/Loading";
import { getAllDonationOpportunities } from "@/services/donationOpportunityService";
import Link from "next/link";
import _ from "lodash";
import { getDonationOpportunitiesRepports } from "@/services/repportsService";
import Swal from "sweetalert2";
import { useCredentials } from "@/context/CredentialsContext";
import { useTheme } from "@/context/ThemeContext";
import dayjs from "dayjs";

export default function COTabs() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [donationOpportunities, setDonationOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const { isLoggedIn, userToken } = useCredentials();

  const subTabs = useMemo(
    () =>
      CONSTANTS.DONATION_TAB_DATA.find((tab) => tab.label === activeTab)
        ?.data || [],
    [activeTab]
  );

  const getData = useCallback(
    async (field = "all", category = "all", searchText = "") => {
      try {
        setLoading(true);
        const data = await getAllDonationOpportunities(
          field,
          category,
          {},
          searchText,
          100,
          userToken
        );
        setDonationOpportunities(data);
      } catch (error) {
        console.error("Error fetching donation opportunities:", error);
      } finally {
        setLoading(false);
      }
    },
    [userToken]
  );

  const debouncedSearch = useMemo(
    () =>
      _.debounce((value) => {
        getData(
          activeTab === "الكل" ? "all" : activeTab,
          activeSubTab === "الكل" ? "all" : activeSubTab,
          value
        );
      }, 500),
    [activeTab, activeSubTab, getData]
  );

  useEffect(() => {
    debouncedSearch(searchTxt);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTxt, debouncedSearch]);

  // useEffect(() => {
  //   getData(
  //     "",
  //     activeTab === "الكل" ? "all" : activeTab,
  //     activeSubTab === "الكل" ? "all" : activeSubTab
  //   );
  // }, [activeTab, activeSubTab]);

  const handleTabClick = (label, data) => {
    setActiveTab(label);
    setActiveSubTab("all");
  };
  const fetchDonationReport = async (id) => {
    try {
      if (!isLoggedIn)
        return Swal.fire({
          title: "يجب عليك تسجيل الدخول لحسابك حتى تتمكن من مراجعة التقرير",
          icon: "info",
        });
      // Display loading alert
      Swal.fire({
        title: "جارٍ تحميل التقرير...",
        text: "يرجى الانتظار قليلاً",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await getDonationOpportunitiesRepports(id, userToken);

      // On success, show report details
      Swal.fire({
        icon: "success",
        title: "تم تحميل التقرير بنجاح",
        confirmButtonText: "حسنًا",
      });
    } catch (error) {
      // On error, show error alert
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "فشل تحميل التقرير",
        text: "حدث خطأ أثناء تحميل التقرير. يرجى المحاولة لاحقاً.",
      });
    }
  };
  return (
    <div className="flex flex-col items-stretch gap-5">
      {/* Tabs */}
      <div className="flex flex-wrap flex-row-reverse justify-center gap-2 my-5">
        {CONSTANTS.DONATION_TAB_DATA.map(({ label, name, icon, data }) => (
          <ButtonTab
            name={name}
            label={label}
            active={activeTab === label}
            handleClick={() => {
              setActiveSubTab(label);
              handleTabClick(label, data);
            }}
          />
        ))}
      </div>

      {/* SubTabs */}
      {subTabs.length > 0 && (
        <div className="flex flex-wrap flex-row-reverse justify-center gap-2">
          {subTabs.map(({ name, label, icon }) => (
            <ButtonTab
              name={name}
              label={label}
              icon={icon}
              active={activeSubTab === label}
              handleClick={() => {
                setActiveSubTab(label);
              }}
            />
          ))}
        </div>
      )}

      {/* Search and Title */}
      <div className="flex flex-wrap md:flex-row-reverse justify-center md:justify-between md:p-5">
        <p className="text-xl md:text-2xl">المشاريع الكتملة</p>
        <div className="w-full max-w-sm min-w-[200px]">
          <div className="relative">
            <input
              dir="rtl"
              value={searchTxt}
              onChange={(e) => setSearchTxt(e.target.value)}
              className="w-full text-right bg-mangoBlack placeholder:text-steel text-slate-700 text-sm border border-borderColor rounded-md pl-28 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="البحث في الفرص"
            />
            <CiSearch
              className="absolute top-2 left-2 text-textColor fill-textColor font-bold"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Donation Opportunities */}
      <div>
        {loading ? (
          <UILoading height="h-20" />
        ) : (
          donationOpportunities.map(
            ({ id, title, city, cardImage, endDate }) => (
              <DonationOppCard
                key={id}
                id={id}
                title={title}
                image={cardImage}
                city={city}
                createdBy={"جمعية البركة"}
                endDate={dayjs(endDate).format("YYYY/MM/DD")}
                getRapport={fetchDonationReport}
              />
            )
          )
        )}
      </div>
    </div>
  );
}

const ButtonTab = ({ name, handleClick, label, active, icon }) => {
  const { isDarkMode } = useTheme();
  return (
    <Button
      key={name}
      onClick={handleClick}
      color={active ? "blue" : isDarkMode ? "gray" : "white"}
      className={` text-textColor md:text-md w-24 md:w-40 flex items-center justify-center rounded-full gap-2`}
    >
      {label}
      {icon}
    </Button>
  );
};

const DonationOppCard = ({
  id,
  image = "/logo/fullLogo.png",
  title,
  createdBy,
  city,
  endDate,
  getRapport,
}) => {
  return (
    <div
      dir="rtl"
      className="text-sm md:text-lg flex flex-col md:flex-row gap-5 md:items-center justify-between p-5 m-2 rounded-md shadow-sm border-2 border-borderColor bg-mangoBlack"
    >
      <div className="flex items-center gap-2">
        <Avatar
          alt="avatar"
          size="lg"
          className="md:w-20 md:h-20"
          src={image}
        />
        <div>
          <p>
            {id}) {title}
          </p>
          <p>الشريك المنفذ : {createdBy}</p>
        </div>
      </div>
      {city && <p>المنطقة : {city}</p>}
      <p>تاريخ الانتهاء : {endDate}</p>
      <div className="flex flex-wrap gap-2 text-[#fff] border-t-2 pt-5 md:p-0 md:border-0">
        <Button
          onClick={() => getRapport(id)}
          className="flex items-center gap-1 "
          color="green"
        >
          <FaClipboardList size={20} />
          عرض التقرير
        </Button>
        <Link href={`/donation-opportunity?id=${id}`}>
          <Button className="flex items-center gap-1" color="cyan">
            <FaExternalLinkSquareAlt size={20} />
            تفاصيل الحالة
          </Button>
        </Link>
      </div>
    </div>
  );
};
