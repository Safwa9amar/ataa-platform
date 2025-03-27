"use client";
import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { Avatar, Typography, Spinner, Button } from "@material-tailwind/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";
import SearchWithMenu from "@/components/UI/SearchWithMenu";
import Dzmap from "./Dzmap";

export default function Page() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { wilayas } = useAlgeriaCitiesContext();
  const [wilayaCode, setWilayaCode] = useState(null);
  const [wilaya, setWilaya] = useState(null);
  const [keywords, setKeywords] = useState("");

  const getData = async (wilaya = "", keywords = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_ENDPOINTS.CHARITIES.SEARCH}?wilaya=${wilaya}&keywords=${keywords}`
      );
      setCharities(res.data);
    } catch (error) {
      console.error("Error fetching charities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const selectedWilaya = wilayas.find(
      (item) => item.wilaya_code === wilayaCode
    );
    setWilaya(selectedWilaya);
    getData(selectedWilaya?.wilaya_name || "", keywords);
  }, [wilayaCode, wilayas, keywords]);

  const handleSearch = (val) => {
    setKeywords(val);
  };

  const handleMenuClick = (item) => {
    const selectedWilaya = wilayas.find(
      (wilaya) => wilaya.wilaya_name === item
    );

    // Highlight the selected wilaya on the map
    document
      .querySelectorAll("path")
      .forEach((el) => el.classList.remove("active-path"));
    document
      .getElementById(selectedWilaya.wilaya_code)
      ?.classList.add("active-path");

    setWilayaCode(selectedWilaya.wilaya_code);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Map Section */}
      <div className="2xl:scale-75 scale-50">
        <Dzmap setWilayaCode={setWilayaCode} />
      </div>

      {/* Content Section */}
      <div dir="rtl" className="md:p-10 flex flex-col gap-5">
        <h1 className="text-4xl font-bold text-secondaryColor">
          الجمعيات الخيرية
        </h1>
        <p className="text-lg text-gray-600">
          قائمة الجمعيات الشريكة لمنصة عطاء
        </p>
        <div className="flex gap-5 text-lg">
          <p>
            <strong className="font-bold text-secondaryColor">الولاية:</strong>{" "}
            {wilaya?.wilaya_name || "غير محددة"}
          </p>
          <p>
            <strong className="font-bold text-secondaryColor">
              عدد الجمعيات:
            </strong>{" "}
            {loading ? "جاري التحميل..." : charities.length || "لا توجد جمعيات"}
          </p>
        </div>
        <div className="flex gap-2">
          <SearchWithMenu
            menuItems={wilayas.map((item) => item.wilaya_name)}
            onInputChange={handleSearch}
            inputValue={keywords}
            onMenuItemClick={handleMenuClick}
            placeholder="البحث باسم الجمعية"
          />
          <Button
            className="rounded-full bg-secondaryColor dark:text-teal-800"
            onClick={() => getData()}
          >
            عرض الكل
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner className="w-10 h-10" color="green" />
          </div>
        ) : charities.length > 0 ? (
          charities.map((charity) => (
            <CharityItem
              key={charity.id}
              name={charity.legalName}
              numOfBeneficiaries={charity.numOfBeneficiaries || "غير متاح"}
              id={charity.id}
            />
          ))
        ) : (
          <Typography variant="h6" className="text-center text-gray-600 mt-10">
            لا توجد جمعيات مطابقة لبحثك.
          </Typography>
        )}
      </div>
    </div>
  );
}

const CharityItem = ({
  id,
  name,
  numOfBeneficiaries,
  mapsURI = "#",
  details = "#",
}) => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-5 items-center justify-between bg-mangoBlack p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Avatar src="/images/Campaigns.png" alt={name} />
      <div className="flex-1">
        <Typography variant="h6" className="font-ElMessiri text-secondaryColor">
          {name}
        </Typography>
        <Typography variant="small" className="text-gray-500">
          عدد المستفيدين: {numOfBeneficiaries}
        </Typography>
      </div>
      <a target="_blank" rel="noopener noreferrer" href={mapsURI}>
        <GrMapLocation size={32} className="text-secondaryColor" />
      </a>
      <Link href={`/charities/${id}`} passHref>
        <FaChevronLeft className="text-secondaryColor text-2xl" />
      </Link>
    </div>
  );
};
