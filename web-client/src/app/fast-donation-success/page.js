"use client";
import { Avatar, Typography, Card, Button } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page({ searchParams }) {
  const router = useRouter();
  const { checkout_id, gateway } = searchParams;
  const gateway_name = gateway === "stripe" ? "سترايب" : "شارجيلي";
  const gateway_img =
    gateway === "stripe"
      ? "/images/wp-stripe-donation.png"
      : "/images/chargily.png";

  return (
    <div
      dir="rtl"
      className="bg-backgroundColor p-10 flex flex-col justify-center items-center px-4"
    >
      <Card className="w-full max-w-lg bg-mangoBlack shadow-lg rounded-lg p-6 flex flex-col items-center">
        <Typography
          variant="h2"
          className="text-green-600 dark:text-green-400 mb-4 text-center font-ElMessiri"
        >
          تم تسجيل تبرعك بنجاح!
        </Typography>
        <Image
          loading="lazy"
          height={250}
          width={350}
          src="/logo/fullLogo.png"
          alt="Logo"
          className="rounded-lg shadow-sm"
        />
        <div className="mt-6 text-center">
          <Typography
            variant="h5"
            className="text-gray-700 dark:text-gray-200 font-semibold mb-2 font-ElMessiri"
          >
            تم التبرع بواسطة بوابة الدفع الإلكتروني:{" "}
            <span className="text-green-500 dark:text-green-400">
              {gateway_name}
            </span>
          </Typography>
          <Typography
            variant="h6"
            className="text-gray-600 dark:text-gray-400 font-medium mb-4 font-ElMessiri"
          >
            رقم عملية الدفع:{" "}
            <span className="font-bold dark:text-white">{checkout_id}</span>
          </Typography>
        </div>
        <Avatar
          loading="lazy"
          width={150}
          src={gateway_img}
          alt={gateway_name}
          className="rounded-lg shadow-md mb-4"
        />
        <Button
          variant="gradient"
          size="lg"
          color="green"
          onClick={() => router.replace("/")}
          className="mt-4 w-full md:w-auto rounded-full font-ElMessiri"
        >
          العودة إلى الصفحة الرئيسية
        </Button>
      </Card>
    </div>
  );
}
