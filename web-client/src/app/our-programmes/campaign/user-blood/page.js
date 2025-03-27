"use client";
import CONSTANTS from "@/config/constants";
import { getCampaignById } from "@/services/campaignServices";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiShare } from "react-icons/bi";
import Markdown from "react-markdown";
import Link from "next/link";
import { useCredentials } from "@/context/CredentialsContext";
import UILoading from "@/components/UI/Loading";
import { useSavedCampaigns } from "@/context/SavedCampaignsContext";
import { Button } from "@material-tailwind/react";
import { CiBookmark } from "react-icons/ci";
import { IoIosBookmark } from "react-icons/io";
import AppointmentList from "./AppointmentList";
import { useShare } from "@/context/ShareContext";
import { getCampaignsRepports } from "@/services/repportsService";
import Swal from "sweetalert2";
import { Gallery } from "@/components/layouts/Gallery";
import Image from "next/image";
import API_ENDPOINTS from "@/config/apiEndPoints";

export default function CampaignPage() {
  const { user, userToken, isLoggedIn } = useCredentials();
  const { openShareModal } = useShare();
  const searchParams = useSearchParams();

  const { toggleSaveCampaign, isCampaignSaved } = useSavedCampaigns();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Fetch campaign data
  let getData = async () => {
    try {
      let data = await getCampaignById(searchParams.get("id"), userToken);
      setData(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleCampaignReport = async () => {
    try {
      if (!isLoggedIn) {
        return Swal.fire({
          title: "يجب عليك تسجيل الدخول لحسابك حتى تتمكن من مراجعة التقرير",
          icon: "info",
        });
      }

      // Show date selection dialog
      const { isConfirmed } = await Swal.fire({
        title: data.title,
        confirmButtonText: "تحميل التقرير",
        showCancelButton: true,
      });

      if (!isConfirmed) return; // Exit if user cancels

      // Show loading Swal
      Swal.fire({
        title: "جاري تحميل التقرير...",
        text: "يرجى الانتظار",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Fetch report
      await getCampaignsRepports(data.id, userToken);

      // Show success message
      Swal.fire("تم بنجاح!", "تم تحميل التقرير.", "success");
    } catch (error) {
      console.error("Error downloading campaign report:", error.message);
      Swal.fire("خطأ", "فشل تحميل التقرير.", "error");
    }
  };
  useEffect(() => {
    getData();
  }, [isLoggedIn]);

  if (loading) return <UILoading />;

  // Check if data is not found
  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          الحملة غير موجودة أو حدث خطأ ما.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6" dir="rtl">
      {/* Campaign Title */}
      <header className="text-right mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {data.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {data.subtitle}
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Description */}
          <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
            <img
              className="rounded-xl w-full"
              src={API_ENDPOINTS.UPLOADS + "/" + data?.images[0].filename}
            />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              وصف الحملة
            </h2>
            <Markdown className="prose prose-sm sm:prose lg:prose-lg text-gray-600 dark:text-gray-400">
              {data.description}
            </Markdown>

            {/* <div className="flex flex-wrap gap-5 m-5">
              {data?.images.map((img) => (
                <Image
                  className="rounded-xl"
                  width={300}
                  height={300}
                  src={API_ENDPOINTS.UPLOADS + "/" + img.filename}
                />
              ))}
            </div> */}
          </div>

          {/* Campaign Progress */}
          <section className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 flex justify-around">
            <div>
              <p className="text-3xl font-bold text-red-500 dark:text-red-400">
                {CONSTANTS.BLOOD_TYPES[data.selectedBloodType]}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                الفصيلة المطلوبة
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500 dark:text-green-400">
                {data?.progress.rate.toFixed(0)} %
              </p>
              <p className="text-gray-500 dark:text-gray-400">نسبة التقدم</p>
            </div>
          </section>

          {/* Donation Details */}
          <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              تفاصيل التبرعات
            </h2>
            <div className="flex justify-around">
              <div>
                <p className="text-3xl font-bold text-green-500 dark:text-green-400">
                  {data.donatedUnits}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  الوحدات المتبرع بها
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">
                  {data.numberOfUnits}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  الوحدات المطلوبة
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              تفاصيل الحملة
            </h2>
            <div className="flex justify-around">
              <div>
                <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {data.visits}
                </p>
                <p className="text-gray-500 dark:text-gray-400">عدد الزيارات</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {data.numOfBeneficiaries}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  عدد المستفيدين
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {data.donationCount}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  عدد عمليات التبرع
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {data.isAgreed ? (
            <div className="flex gap-4">
              {user.id === data.createdByuserId ? (
                data?.progress?.rate === 100 && (
                  <Button
                    variant="gradient"
                    color="red"
                    className="rounded-full font-ElMessiri"
                    onClick={handleCampaignReport}
                  >
                    عرض تقرير الحملة
                  </Button>
                )
              ) : (
                <Link
                  href={`./user-blood/book-appointment?id=${data.id}&title=${data.title}`}
                >
                  <Button className="rounded-full font-ElMessiri" color="red">
                    ساهم في انقاذ حياة
                  </Button>
                </Link>
              )}
              <Button
                className="rounded-full font-ElMessiri"
                aria-label="Bookmark Campaign"
                color="indigo"
                onClick={() => toggleSaveCampaign(data)}
              >
                {isCampaignSaved(data.id) ? (
                  <IoIosBookmark size={20} />
                ) : (
                  <CiBookmark size={20} />
                )}
              </Button>
              <Button
                color="indigo"
                className="rounded-full font-ElMessiri"
                aria-label="Share Campaign"
                onClick={() =>
                  openShareModal({
                    url:
                      window.location.host +
                      `/our-programmes/campaign/user-blood?id=${data.id}&title=${data.title}`,
                    title: data.title,
                    userId: user.id,
                    type: "campaign",
                    itemId: data.id,
                  })
                }
              >
                <BiShare size={20} />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Map Section */}
        {data.googleMapLink && (
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 space-y-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d513053.609077465!2d-1.256607210937482!3d35.18319860000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7f01b0603fc5d3%3A0x6f95ea3ee735f146!2sCHU%20Abdelkader%20Hassani!5e1!3m2!1sfr!2sdz!4v1735531268723!5m2!1sfr!2sdz"
                loading="lazy"
                className="w-full h-64 rounded"
                title="Google Maps"
              ></iframe>
              <p>{data.bloodBankName}</p>
              <br />
              <a
                href={data.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:underline"
              >
                عرض الموقع على خرائط جوجل
              </a>
            </div>
          </div>
        )}
      </section>
      {user.id === data.createdByuserId && (
        <section className="mt-10">
          <h1 className="text-2xl">ادارة المواعيد</h1>
          <AppointmentList id={data.id} />
        </section>
      )}
    </div>
  );
}
