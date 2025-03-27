"use client";
import { useCredentials } from "@/context/CredentialsContext";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function Layout({ children }) {
  const pathname = usePathname();
  const {
    user: { role },
  } = useCredentials();

  const links = [
    {
      href: "/saved-opportunities",
      label: "الفرص المحفوظة",
      donor: true,
      partner: true,
      charity: true,
      blood_agency: true,
    },
    {
      href: "/saved-opportunities/store",
      label: "فرص تبرع المتجر",
      donor: true,
      partner: true,
      charity: true,
      blood_agency: true,
    },
    {
      href: "/saved-opportunities/campaigns",
      label: "الحملات المحفوظة",
      donor: true,
      partner: false,
      charity: false,
      blood_agency: false,
    },
  ];

  return (
    <div dir="rtl" className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-700">الفرص المحفوظة</h1>
        <p className="text-gray-500">
          هنا تجد جميع الفرص التي قمت بحفظها للرجوع إليها لاحقًا.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-8">
        {links
          .filter((link) => link[role])
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full shadow-sm px-4 py-2 text-center border-borderColor  transition-all duration-200 ${
                link.href === pathname
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                  : "bg-mangoBlack border  dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
