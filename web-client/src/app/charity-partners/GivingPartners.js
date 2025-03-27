"use client";
import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "@/config/apiEndPoints";
import PartnerCard from "@/components/UI/PartnerCard";
import Swal from "sweetalert2";
import Image from "next/image";
import CONSTANTS from "@/config/constants";
import { GrMapLocation } from "react-icons/gr";

export default function GivingPartners() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.GIVINGPARTNERS.GET_ALL);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Function to show partner details in a SweetAlert modal
  const showPartnerDetails = (partner) => {
    Swal.fire({
      title: `تفاصيل الشريك: ${partner.name}`,
      html: `
        <div class="flex flex-col items-center">
          <p class="text-textColor font-semibold">
            <strong>الاسم: </strong> ${partner.name}
          </p>
          <p class="text-textColor font-semibold">
            <strong>النوع: </strong> ${
              CONSTANTS.OTHER[partner.type] || "غير محدد"
            }
          </p>
          <p class="text-textColor font-semibold">
            <strong>نوعية الشراكة: </strong> ${
              CONSTANTS.OTHER[partner.PartnershipType] || "غير محدد"
            }
          </p>
          <div class="w-1/2 border-[1px] border-gray-400 rounded-full my-3"></div>
          <p class="text-gray-600 italic">موقع الشركة على خرائط قوقل:</p>
          <a href="${partner.Headquarters}" target="_blank" class="mt-3">
            <i class="fas fa-map-marker-alt text-red-500 text-3xl"></i>
          </a>
        </div>
      `,
      imageUrl: partner.logo || "/logo/fullLogo.png",
      imageWidth: 200,
      imageHeight: 200,
      confirmButtonText: "موافق",
      customClass: {
        popup: "rounded-lg shadow-lg",
        title: "text-green-600 font-bold text-2xl",
        confirmButton: "bg-green-500 hover:bg-green-600 text-white",
      },
      allowOutsideClick: false,
    });
  };

  return (
    <>
      {/* Partners Section */}
      <div className={`flex flex-wrap justify-center gap-5`}>
        {loading ? (
          <div className="flex gap-5">
            <div className="w-[100px] h-[100px] bg-gray-600 animate-pulse rounded-xl" />
            <div className="w-[100px] h-[100px] bg-gray-600 animate-pulse rounded-xl" />
            <div className="w-[100px] h-[100px] bg-gray-600 animate-pulse rounded-xl" />
          </div>
        ) : (
          data.map((partner, index) => (
            <PartnerCard
              handleClick={() => showPartnerDetails(partner)}
              key={index}
              partnerName={partner.name}
              partnerImage={partner.logo}
            />
          ))
        )}
      </div>
    </>
  );
}
