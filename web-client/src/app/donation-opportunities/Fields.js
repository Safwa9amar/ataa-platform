"use client";
import Button from "@/components/UI/Button";
import { DonationCard } from "@/components/UI/DonationCard";
import Typography from "@/components/UI/Typography";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";
import { getAllDonationOpportunities } from "@/services/donationOpportunityService";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaFacebook } from "react-icons/fa";

export default function Fields({ field, ar_title, description, icon }) {
  const { fields } = useFieldCategoryContext();
  const [selectedCat, setSelectedCat] = useState({ title: "all" });
  const [donationData, setDonationData] = useState([]);

  // Fetch categories for the selected field, with error handling
  const categories = useMemo(() => {
    const fieldData = fields.find((item) => item.title === field);
    return fieldData ? fieldData.categories : [];
  }, [fields, field]);

  const filteredDonations = useMemo(
    () =>
      donationData
        .filter((item) => item.field.title === field)
        .filter((item) =>
          selectedCat.title === "all"
            ? true
            : item.category.title === selectedCat.title
        ),
    [donationData, field, selectedCat]
  );

  const getData = async () => {
    let data = await getAllDonationOpportunities(field, "", "", "", "", "");
    setDonationData(data);
  };
  useEffect(() => {
    getData();
  }, [field]);

  // if (!donationData.length) return null;

  return (
    <>
      <div className="md:border-2 md:border-borderColor p-4 md:rounded-md flex flex-col items-center">
        <div className="p-2 w-full flex flex-col gap-3 my-2">
          <div className="w-full flex flex-wrap md:justify-between">
            <Typography
              variant="h3"
              className="self-start font-ElMessiri flex items-center gap-3"
            >
              {icon}
              <>{ar_title}</>
            </Typography>
            <div>
              {categories.length > 0 && (
                <div className="flex flex-wrap  gap-2 p-4 rounded-md ">
                  <Button
                    className={`text-[#fff] rounded-full ${
                      selectedCat.title === "all"
                        ? "bg-cyan-600 text-gray-900"
                        : "bg-gray-600"
                    }`}
                    onClick={() =>
                      setSelectedCat({
                        title: "all",
                      })
                    }
                  >
                    الكل
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      className={`text-[#fff] rounded-full ${
                        selectedCat.title === cat.title
                          ? "bg-cyan-600 "
                          : "bg-gray-600"
                      }`}
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat.ar_title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Typography className="self-start  md:text-lg font-ElMessiri">
            {description}
          </Typography>
        </div>
        {/* Category Tabs with "All" Button */}

        {/* Donations Display */}
        <div className="flex gap-3 flex-wrap justify-around items-stretch mt-4 w-full  md:p-5 rounded-md">
          {filteredDonations.length ? (
            filteredDonations
              .slice(0, 3)
              .map((item) => <DonationCard key={item.id} data={item} />)
          ) : (
            <Typography variant="body2" className="text-gray-500 mt-4">
              لاتوجد فرص تبرع حاليا
            </Typography>
          )}
        </div>

        {/* Load More Button */}
        <Link href={`/donation-opportunities/${field}`}>
          <Button className="text-[#fff] rounded-full m-2 mt-5">
            عرض المزيد
          </Button>
        </Link>
      </div>
    </>
  );
}

export function CategorySkeletonLoader() {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-10 animate-pulse mt-10">
      {/* Skeleton for "All" button */}
      <Button
        className="text-transparent bg-gray-300 rounded-full w-20 h-10"
        disabled
      >
        &nbsp;
      </Button>

      {/* Skeletons for category buttons */}
      {[...Array(3)].map((_, index) => (
        <Button
          key={index}
          className="text-transparent bg-gray-300 rounded-full w-20 h-10"
          disabled
        >
          &nbsp;
        </Button>
      ))}
    </div>
  );
}
