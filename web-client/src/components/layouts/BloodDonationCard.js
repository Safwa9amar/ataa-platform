"use client";
import * as React from "react";
import Image from "next/image";
import {
  Button,
  ButtonGroup,
  CardHeader,
  IconButton,
  Progress,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { IoOpen, IoShareSocial } from "react-icons/io5";
import Link from "next/link";
import CONSTANTS from "@/config/constants";
import { useSavedCampaigns } from "@/context/SavedCampaignsContext";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useCredentials } from "@/context/CredentialsContext";
import { useShare } from "@/context/ShareContext";
import Swal from "sweetalert2";
import { getCampaignsRepports } from "@/services/repportsService";
import withReactContent from "sweetalert2-react-content";
import { IoIosWarning } from "react-icons/io";
const mySwal = withReactContent(Swal);

function BloodDonationCard({
  id,
  rate,
  numberOfUnits,
  donatedUnits,
  title = "Campaign Title",
  status = "حالة الحملة",
  urgency = "مستعجلة",
  bloodType = "A_POSITIVE",
  description = "Default description for the campaign.",
  mainImage,
  buttonLabel = "تبرع الآن",
  isAgreed,
  createdByuserId,
  rejected,
  rejectedAt,
  rejectedBy,
  rejectedWhy = "### ccc",
}) {
  const { toggleSaveCampaign, isCampaignSaved } = useSavedCampaigns();
  const { isLoggedIn, user, userToken } = useCredentials();
  const { openShareModal } = useShare();
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
        title: title,
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
      await getCampaignsRepports(id, userToken);

      // Show success message
      Swal.fire("تم بنجاح!", "تم تحميل التقرير.", "success");
    } catch (error) {
      console.error("Error downloading campaign report:", error.message);
      Swal.fire("خطأ", "فشل تحميل التقرير.", "error");
    }
  };

  const showRejectWhy = (e) => {
    e.preventDefault();
    mySwal.fire({
      title: "سبب رفض الحملة",
      html: <div>{rejectedWhy}</div>, // TODO : update rejectedWhy section
    });
  };

  return (
    <Link
      href={`/our-programmes/campaign/user-blood?id=${id}&title=${title}`}
      className="relative flex flex-col items-center justify-center py-6 bg-mangoBlack rounded-lg max-w-lg shadow-md overflow-hidden"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-start w-full px-5 mb-4">
        <Typography className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-100 truncate font-ElMessiri">
          {title}
        </Typography>

        {rejected ? (
          <Tooltip
            placement="top-start"
            content={`للاسف تم رفض حملتك من طرف ${rejectedBy || "المنصة"}`}
            variant="gradient"
            className="font-ElMessiri bg-amber-100 text-amber-900 rounded-full my-2 self-start m-4"
          >
            <Button onClick={showRejectWhy} variant="text" className="p-0 m-0">
              <IoIosWarning className="fill-amber-800" size={30} />
            </Button>
          </Tooltip>
        ) : (
          <ButtonGroup dir="ltr" size="sm" color="red" variant="outlined">
            {isAgreed && (
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  openShareModal({
                    url: `${window.location.host}/our-programmes/campaign/user-blood?id=${id}&title=${title}`,
                    title,
                    userId: user.id,
                    type: "campaign",
                    itemId: id,
                  });
                }}
              >
                <IoShareSocial size={20} />
              </IconButton>
            )}
            {isAgreed && (
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  toggleSaveCampaign({
                    id,
                    title,
                    rate,
                    status,
                    urgency,
                    description,
                    mainImage,
                    CampaignType: "BLOOD",
                  });
                }}
              >
                {isCampaignSaved(id) ? (
                  <FaBookmark size={20} />
                ) : (
                  <FaRegBookmark size={20} />
                )}
              </IconButton>
            )}
          </ButtonGroup>
        )}
      </div>
      {/* Main Image */}
      {mainImage && (
        <Image
          src={mainImage || "/logo/fullLogo.png"}
          alt="Campaign Image"
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-md"
          loading="lazy"
        />
      )}
      {/* Progress and Details */}
      <div className="w-full px-5 mt-4">
        {isAgreed && (
          <div className="w-full px-4 mt-4">
            <Progress
              value={rate?.toFixed(2)}
              label="مكتمل"
              className="bg-gray-200 dark:bg-gray-700"
            />
          </div>
        )}
        <div className="flex justify-between items-center mt-3 text-sm text-gray-600 dark:text-gray-300">
          <p>
            {status} : <span className="font-medium">{urgency}</span>
          </p>
          <div className="bg-bloodTypeHolder bg-cover w-16 h-16 flex items-center justify-center ">
            <span className="text-lg font-bold text-red-600 pb-3">
              {CONSTANTS.BLOOD_TYPES[bloodType]}
            </span>
          </div>
        </div>
        <div className="text-sm mt-2">
          <p>عدد الوحدات المستهدفة: {numberOfUnits}</p>
          <p>عدد الوحدات المتبرع بها: {donatedUnits}</p>
        </div>
      </div>
      {/* Description */}
      <div className="w-full px-5 mt-3">
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {description}
        </p>
      </div>
      {/* Call to Action */}
      {isLoggedIn && isAgreed && (
        <div className="flex  items-center justify-evenly gap-2 w-[90%] md:w-[80%] lg:w-[70%] my-2">
          <Link
            href={
              user.id === createdByuserId
                ? `/our-programmes/campaign/user-blood?id=${id}&title=${title}`
                : `/our-programmes/campaign/user-blood/book-appointment?id=${id}&title=${title}`
            }
            className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-full text-sm md:text-base"
          >
            {user.id === createdByuserId ? "عرض  حجوزات الحملة" : buttonLabel}
          </Link>

          {user.id === createdByuserId && rate === 100 && (
            <Button
              color="red"
              variant="outlined"
              className="rounded-full w-full p-3"
              onClick={handleCampaignReport}
            >
              عرض التقرير
            </Button>
          )}
        </div>
      )}
      {user.id === createdByuserId && rejected && rate !== 100 && (
        <Button
          color="deep-orange"
          className="rounded-full w-[90%] md:w-[80%] lg:w-[70%] my-2 font-ElMessiri"
          onClick={showRejectWhy}
        >
          اطلع على اسباب الرفض
        </Button>
      )}
    </Link>
  );
}

export default BloodDonationCard;
