"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa6";
import AnimatedCampaignsCard from "@/components/layouts/AnimatedCampaignsCard";
import { useRouter } from "next/navigation";
import { Button } from "@material-tailwind/react";
import { useSavedStoreOpportunities } from "@/context/SavedStoreOpportunitiesContext";

export default function Page() {
  const { savedStoreOpportunities, removeStoreOpportunity } =
    useSavedStoreOpportunities();
  const { theme } = useTheme();
  const router = useRouter();
  const handleRemoveOpportunity = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم إزالة هذه الفرصة المحفوظة.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.primaryColor,
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفها!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        removeStoreOpportunity(id);
        Swal.fire("تم الحذف!", "تمت إزالة الفرصة بنجاح.", "success");
      }
    });
  };

  return (
    <>
      {/* Saved Opportunities List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {savedStoreOpportunities.length > 0 ? (
          savedStoreOpportunities.map((item) => (
            <div key={item.id} className="relative overflow-hidden">
              {/* Opportunity Card */}
              <Link href={`/donations-store/oppertunities/${item.id}`}>
                <AnimatedCampaignsCard
                  image={{ src: item.cardImage, alt: item.title }}
                  label={item.title}
                  description={item.description}
                />
              </Link>

              {/* Delete Icon */}
              <button
                onClick={() => handleRemoveOpportunity(item.id)}
                className="absolute top-3 left-3 bg-red-100 dark:bg-red-400 text-red-500 dark:text-white p-2 rounded-full hover:bg-red-200"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <Image
              src="/images/nodata.png"
              alt="No Data"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <p className="text-gray-600">لا توجد فرص محفوظة في الوقت الحالي.</p>
            <Link href="/donation-opportunities" className="my-5 ">
              <Button
                className="font-ElMessiri"
                variant="gradient"
                color="green"
              >
                استعرض فرص التبرع
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
