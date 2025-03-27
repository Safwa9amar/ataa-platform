"use client";
import * as React from "react";
import Image from "next/image";
import {
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Progress,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { IoOpen, IoShareSocial } from "react-icons/io5";
import Link from "next/link";
import { useSavedCampaigns } from "@/context/SavedCampaignsContext";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useCredentials } from "@/context/CredentialsContext";
import { useShare } from "@/context/ShareContext";
import Swal from "sweetalert2";
import { getCampaignsRepports } from "@/services/repportsService";
import { IoIosWarning } from "react-icons/io";
import withReactContent from "sweetalert2-react-content";
import Markdown from "react-markdown";

const mySwal = withReactContent(Swal);
function CampaignCard({
  id,
  rate,
  title = "Campaign Title",
  status = "حالة الحملة",
  urgency = "مستعجلة",
  amountCollected = "دج 15000",
  description = "Default description for the campaign.",
  mainImage,
  buttonLabel = "تبرع الآن",
  onDonate,
  createdByuserId,
  isAgreed,
  rejected,
  rejectedAt,
  rejectedBy,
  rejectedWhy = "### ccc",
}) {
  const { toggleSaveCampaign, isCampaignSaved } = useSavedCampaigns();
  const { isLoggedIn, user, userToken } = useCredentials();
  const { openShareModal } = useShare();
  const handleCampaignReport = async (e) => {
    e.preventDefault();

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
      href={`/our-programmes/campaign/details/${id}`}
      className="relative flex flex-col items-center py-6 bg-mangoBlack rounded-lg shadow-md max-w-lg overflow-hidden"
      dir="rtl"
    >
      {/* Header */}{" "}
      <div className="flex justify-between items-start w-full px-4 mb-4">
        <Typography className="flex-1 text-base font-medium text-gray-800 dark:text-gray-100 truncate font-ElMessiri">
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
          <ButtonGroup dir="ltr" size="sm" color="green" variant="outlined">
            {isAgreed && (
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  openShareModal({
                    url: `${window.location.host}/our-programmes/campaign/details/${id}`,
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
                    amountCollected,
                    description,
                    mainImage,
                    CampaignType: "GOODS",
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
          src={mainImage}
          alt="Campaign Image"
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-md"
          loading="lazy"
        />
      )}
      {/* Progress */}
      {isAgreed && (
        <div className="w-full px-4 mt-4">
          <Progress
            value={rate?.toFixed(2)}
            label="مكتمل"
            className="bg-gray-200 dark:bg-gray-700"
          />
        </div>
      )}
      {/* Details */}
      <div className="w-full px-4 mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <p>
            {status}
            <br />
            <span className="font-medium">{urgency}</span>
          </p>
          <p>
            تم جمع
            <br />
            <span className="font-medium">{amountCollected}</span>
          </p>
        </div>
        <p className="mt-3 text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {description}
        </p>
      </div>
      {/* Call to Action */}
      {isLoggedIn && isAgreed && (
        <>
          {user.id === createdByuserId && rate === 100 && (
            <Button
              color="green"
              className="rounded-full w-[90%] md:w-[80%] lg:w-[70%] my-2"
              onClick={handleCampaignReport}
            >
              عرض التقرير
            </Button>
          )}

          {user.id !== createdByuserId && (
            <Link
              href={`/donate-now?type=campaign&id=${id}`}
              className="flex justify-center items-center w-[90%] md:w-[80%] lg:w-[70%] mt-5 bg-green-500 hover:bg-green-600 text-white py-2 rounded-full text-sm md:text-base font-medium"
              onClick={onDonate}
            >
              {buttonLabel}
            </Link>
          )}
        </>
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

export default CampaignCard;
