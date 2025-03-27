"use client";
import { useShare } from "@/context/ShareContext";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa6";

export default function ShareModal() {
  const { isModalOpen, toggleShareModal, shareData } = useShare();

  const { url, title } = shareData || {
    url: "https://ataa.ma",
    title: "مشاريع منصة عطاء الدائمة",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("تم نسخ الرابط بنجاح");
  };

  return (
    <Dialog
      open={isModalOpen}
      handler={toggleShareModal}
      size="md"
      dir="rtl"
      className="p-4"
    >
      <DialogHeader className="text-center">
        <Typography variant="h4" className="font-ElMessiri">
          مشاركة الآن
        </Typography>
      </DialogHeader>
      <DialogBody>
        {/* Icon and Heading */}
        <div className="text-center mt-2 mb-6">
          <img
            className="rounded mx-auto mb-4 w-64 h-64"
            src="/images/social-share.png"
            alt="Share Icon"
          />
        </div>

        {/* Share Link Section */}
        <div className="flex items-center gap-2 mt-4">
          <i className="fas fa-link text-gray-400 text-2xl"></i>
          <span className="text-brown-500 font-bold text-lg">
            رابط المشاركة
          </span>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <input
            type="text"
            id="shareLink"
            className="w-[70%] px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-primary-300"
            value={url}
            readOnly
            aria-label="رابط المشاركة"
          />
          <button
            onClick={copyToClipboard}
            className="bg-brown-500 w-[20%] h-fit font-ElMessiri text-white py-2 px-4 rounded-lg hover:bg-brown-600 transition"
          >
            نسخ الرابط
          </button>
        </div>

        {/* Social Media Icons */}
      </DialogBody>
      <DialogFooter className="flex justify-center mt-4">
        <div className="flex justify-center gap-6 mb-6">
          <a
            id="whatsappShareLink"
            className="hover:scale-105 transition-transform"
            href={`whatsapp://send?text=${title} ${url}`}
            data-action="share/whatsapp/share"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="شارك عبر واتساب"
          >
            <FaWhatsapp size={50} className="text-green-500" />
          </a>
          <a
            id="twitterShareLink"
            className="hover:scale-105 transition-transform"
            href={`https://twitter.com/intent/tweet?text=${title}&url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="شارك عبر تويتر"
          >
            <FaTwitter size={50} className="text-blue-400" />
          </a>
          <a
            id="facebookShareLink"
            className="hover:scale-105 transition-transform"
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="شارك عبر فيسبوك"
          >
            <FaFacebook size={50} className="text-blue-600" />
          </a>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
