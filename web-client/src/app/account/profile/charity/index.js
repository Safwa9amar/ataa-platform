"use client";

import { useCredentials } from "@/context/CredentialsContext";
import { useTheme } from "@/context/ThemeContext";
import { Alert, Button, Typography } from "@material-tailwind/react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { Flip, toast } from "react-toastify";

export default function CharityPage() {
  const { user, loading } = useCredentials();
  const { isDarkMode } = useTheme();
  const { charity } = user || {};
  const Msg = () => (
    <div color="orange" className="mb-4 text-center" variant="gradient">
      <p className="text-lg font-medium">
        يبدو أنك لم تكمل الخطوة الثانية من تسجيل الجمعية الخيرية.
      </p>
      <p className="mt-2">
        من فضلك،{" "}
        <Link
          href="/account/profile/charity/step2"
          className="text-blue-500 underline"
        >
          اضغط هنا
        </Link>{" "}
        لإكمال التفاصيل المطلوبة واستفادة من جميع خدماتنا.
      </p>
    </div>
  );
  useEffect(() => {
    charity &&
      (!charity?.mainActivities || !charity?.majorAchievements) &&
      toast.info(<Msg />, {
        isLoading: loading,
        position: "bottom-left",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
        transition: Flip,
        toastId: 1,
      });
  }, [charity, isDarkMode]);
  return (
    <div className="container mx-auto p-6" dir="rtl">
      <Typography variant="h4">تفاصيل الفترة التجريبية</Typography>
      {user?.trialEndDate && (
        <Alert color="green" className="mt-4">
          الفترة التجريبية تنتهي بتاريخ:{" "}
          <strong>{moment(user?.trialEndDate).format("YYYY-MM-DD")}</strong>
        </Alert>
      )}
      {/* Placeholder for Charity Content */}
      {charity ? (
        <h1 className="text-3xl font-bold text-gray-800">
          مرحباً بك في لوحة تحكم الجمعية الخيرية
        </h1>
      ) : (
        <p className="text-lg text-gray-600">
          يتم تحميل بيانات حسابك... يرجى الانتظار.
        </p>
      )}
    </div>
  );
}
