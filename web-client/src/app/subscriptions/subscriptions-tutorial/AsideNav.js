import React, { useState } from "react";
import { motion } from "framer-motion";
import { Collapse, Typography, Card, CardBody } from "@material-tailwind/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import * as Icons from "react-icons/fa"; // Import all Font Awesome icons
import {
  ChevronDoubleDownIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

// Arabic Data with Icon Names
const data = [
  {
    id: "1",
    title: "فيديو تعليمي للمنصة",
    list: [
      {
        id: "1",
        title: "كيفية انشاء حملة",
        href: "/subscriptions/subscriptions-tutorial/كيفيةانشاء حملة",
        icon: "FaVideo",
      },
      { id: "2", title: "نظرة عامة على المنصة", href: "#", icon: "FaTasks" },
    ],
  },
  {
    id: "2",
    title: "استخدام الباقة الأساسية",
    list: [
      {
        id: "1",
        title: "إعداد الميزات الأساسية",
        href: "#",
        icon: "FaToolbox",
      },
      {
        id: "2",
        title: "حل المشكلات الشائعة",
        href: "#",
        icon: "FaQuestionCircle",
      },
    ],
  },
  {
    id: "3",
    title: "استكشاف الباقة المتوسطة",
    list: [
      { id: "1", title: "دليل الميزات المتقدمة", href: "#", icon: "FaUsers" },
      { id: "2", title: "أدوات التعاون الجماعي", href: "#", icon: "FaTasks" },
    ],
  },
  {
    id: "4",
    title: "احتراف الباقة المميزة",
    list: [
      { id: "1", title: "الميزات الحصرية", href: "#", icon: "FaToolbox" },
      {
        id: "2",
        title: "خيارات الدعم المميز",
        href: "#",
        icon: "FaQuestionCircle",
      },
    ],
  },
  {
    id: "5",
    title: "مصادر إضافية",
    list: [
      {
        id: "1",
        title: "الأسئلة الشائعة",
        href: "#",
        icon: "FaQuestionCircle",
      },
      { id: "2", title: "روابط المجتمع", href: "#", icon: "FaUsers" },
    ],
  },
];

export default function AsideNav() {
  const [openCollapse, setOpenCollapse] = useState(null);

  const toggleCollapse = (id) => {
    setOpenCollapse((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <motion.aside
        className="w-full lg:w-1/4 bg-gray-100 dark:bg-gray-900 p-4 md:p-6 rounded-lg shadow-md"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center lg:text-right">
          قائمة الفيديوهات
        </h2>
        <ul className="space-y-6">
          {data.map((section) => (
            <li
              key={section.id}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <button
                onClick={() => toggleCollapse(section.id)}
                className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                <span>{section.title}</span>
                {openCollapse === section.id ? (
                  <ChevronUpDownIcon className="w-5 h-5" />
                ) : (
                  <ChevronDoubleDownIcon className="w-5 h-5" />
                )}
              </button>
              <Collapse open={openCollapse === section.id}>
                <Card className="bg-gray-50 dark:bg-gray-800 mt-3">
                  <CardBody>
                    <ul className="space-y-3">
                      {section.list.map((item) => {
                        // Dynamically render the icon using react-icons
                        const Icon = Icons[item.icon];
                        return (
                          <li
                            key={item.id}
                            className="text-right flex gap-2 items-center"
                          >
                            {Icon && (
                              <Icon className="text-teal-500 w-5 h-5 inline-block mr-2" />
                            )}
                            <Link
                              href={item.href}
                              className="text-teal-600 hover:text-teal-500 transition"
                            >
                              {item.title || "عنوان غير متوفر"}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </CardBody>
                </Card>
              </Collapse>
            </li>
          ))}
        </ul>
      </motion.aside>
    </>
  );
}
