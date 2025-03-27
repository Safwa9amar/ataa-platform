import React, { createContext, useState, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "./CredentialsContext";
import { Button } from "@material-tailwind/react";

// Create Context
const ShareContext = createContext();
const MySwal = withReactContent(Swal);

// ShareProvider Component
export const ShareProvider = ({ children }) => {
  const { isLoggedIn, checkAuthentication, userToken, user } = useCredentials();

  // Open Share Modal
  const openShareModal = async (data) => {
    showShareDialog(data);
  };

  // Handle Share Click (generate link for selected platform)
  const handleShareClick = async (platform, data) => {
    try {
      let shareLink;
      if (isLoggedIn && user.role === "donor") {
        const response = await axios.post(API_ENDPOINTS.BASE_URL + "/share", {
          userId: data.userId,
          type: data.type,
          itemId: data.itemId,
          platform, // Send platform name
        });

        shareLink = response.data.uniqueLink;
        checkAuthentication(userToken);
      } else {
        shareLink = data.url;
      }
      Swal.fire({
        title: "نسخ الرابط الى الحافظة",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        preConfirm: (confirm) => {
          confirm && navigator.clipboard.writeText(shareLink);
        },
      });

      window.open(getPlatformUrl(platform, shareLink, data.title), "_blank");
    } catch (error) {
      console.error("Error generating share link", error);
      Swal.fire("خطأ", "حدث خطأ أثناء إنشاء رابط المشاركة", "error");
    }
  };

  // Generate URL for each platform
  const getPlatformUrl = (platform, url, title) => {
    switch (platform) {
      case "whatsapp":
        return `whatsapp://send?text=${title}&&url=${url}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case "instagram":
        return `https://www.instagram.com/sharer/sharer.php?u=${url}`;
      default:
        return url;
    }
  };

  // Share Dialog using SweetAlert2
  const showShareDialog = (data) => {
    MySwal.fire({
      title: <strong>مشاركة الآن</strong>,
      html: (
        <div dir="rtl" className="text-center">
          {/* Share Header */}
          <img
            className="rounded mx-auto w-32 h-32 mb-4"
            src="/images/social-share.png"
            alt="Share Icon"
          />
          <h5 className="text-teal-500 font-bold text-lg mb-4">
            مشاركة عبر وسائل التواصل الاجتماعي
          </h5>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => handleShareClick("whatsapp", data)}
              aria-label="شارك عبر واتساب"
              className="hover:scale-105 transition-transform"
            >
              <FaWhatsapp size={50} className="text-teal-500" />
            </button>
            <button
              onClick={() => handleShareClick("twitter", data)}
              aria-label="شارك عبر تويتر"
              className="hover:scale-105 transition-transform"
            >
              <FaXTwitter color="teal" size={50} className="stroke-teal-400" />
            </button>
            <button
              onClick={() => handleShareClick("facebook", data)}
              aria-label="شارك عبر فيسبوك"
              className="hover:scale-105 transition-transform"
            >
              <FaFacebook size={50} className="text-teal-600" />
            </button>
            <button
              onClick={() => handleShareClick("instagram", data)}
              aria-label="شارك عبر انستغرام"
              className="hover:scale-105 transition-transform"
            >
              <FaInstagram size={50} className="text-teal-600" />
            </button>
          </div>
          <h5 className="text-textColor font-bold text-sm mb-4">
            شارك واحصل على نقاط سفراء عطاء
          </h5>
          {/* Share Link Section */}

          <div className="mt-2 flex items-center gap-4">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(data.url);
                Swal.fire("تم النسخ", "تم نسخ الرابط إلى الحافظة", "success");
              }}
              color="teal"
              className="rounded-full"
            >
              نسخ الرابط
            </Button>
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-primary-300"
              value={data.url || ""}
              readOnly
              aria-label="رابط المشاركة"
              onClick={(e) => e.target.select()} // Auto-select for easier copying
            />
          </div>
        </div>
      ),
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: "rounded-lg shadow-lg p-6 bg-mangoBlack",
      },
    });
  };

  return (
    <ShareContext.Provider value={{ openShareModal }}>
      {children}
    </ShareContext.Provider>
  );
};

// Hook to use ShareContext
export const useShare = () => useContext(ShareContext);
