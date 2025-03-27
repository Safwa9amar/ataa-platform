"use client";
import React from "react";
import Link from "next/link";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoIosCash } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    name: "معلومات الحساب",
    icon: MdOutlineAccountCircle,
    link: "/account/profile/donor",
  },
  {
    name: "كلمة المرور والحماية",
    icon: CiLock,
    link: "/account/profile/donor/password-security",
  },

  {
    name: "شحن رصيدي",
    icon: IoIosCash,
    link: "/account/profile/donor/balance-recharge",
  },
  {
    name: "استبدال نقاط سفراء عطاء",
    icon: IoIosCash,
    link: "/account/profile/donor/points-reedom",
  },
  {
    name: "استعمالات الرصيد",
    icon: IoIosCash,
    link: "/account/profile/donor/balance-uses",
  },
  {
    name: "سجل شحن الرصيد",
    icon: IoIosCash,
    link: "/account/profile/donor/balance-history",
  },
  {
    name: "سجل التبرع",
    icon: FaHistory,
    link: "/account/profile/donor/donation-history",
  },
];

export default function Aside() {
  const router = useRouter();
  const handleNavigation = (link) => router.push(link);

  return (
    <Card dir="rtl" className="bg-nav_bg">
      <List>
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ListItem
              className="cursor-pointer dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-gray-700 font-ElMessiri text-sm font-bold"
              onClick={() => handleNavigation(item.link)}
            >
              <ListItemPrefix>
                <item.icon
                  className="text-blue-500 dark:text-blue-300 ml-2"
                  size={26}
                />
              </ListItemPrefix>
              {item.name}
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Card>
  );
}
