import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { TbDeviceLandlinePhone } from "react-icons/tb";

export default function ContactPage() {
  const contacts = [
    {
      type: "WhatsApp",
      icon: <FaWhatsapp size={32} className="text-green-500" />,
      value: process.env.NEXT_PUBLIC_WHATSAPP_PHONE,
      href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`,
    },
    {
      type: "Phone",
      icon: <IoCall size={32} className="text-blue-500" />,
      value: process.env.NEXT_PUBLIC_CALL_PHONE,
      href: `tel:${process.env.NEXT_PUBLIC_CALL_PHONE}`,
    },
    {
      type: "Landline",
      icon: <TbDeviceLandlinePhone size={32} className="text-gray-500" />,
      value: process.env.NEXT_PUBLIC_FIX_PHONE,
      href: `tel:${process.env.NEXT_PUBLIC_FIX_PHONE}`,
    },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
      {contacts.map((contact, index) => (
        <Link
          key={index}
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 mb-4 p-4 bg-white dark:bg-nav_bg rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          {contact.icon}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {contact.type}
            </p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {contact.value}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
