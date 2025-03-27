"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoIosCash } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    name: "معلومات الحساب",
    icon: MdOutlineAccountCircle,
    link: "/account/profile/partner",
    subItems: [],
  },
  {
    name: "كلمة المرور والحماية",
    icon: CiLock,
    link: "/account/profile/partner/password-security",
    subItems: [],
  },
];

export default function Aside() {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  const handleToggleCollapse = (index, item) => {
    if (item.subItems.length === 0) {
      router.push(item.link);
      return;
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const subMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <Card dir="rtl" className="bg-nav_bg">
      <List>
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
          >
            <ListItem
              className="cursor-pointer dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-gray-700 font-ElMessiri text-md font-bold"
              onClick={() => handleToggleCollapse(index, item)}
            >
              <ListItemPrefix>
                <item.icon
                  className="text-blue-500 dark:text-blue-300 ml-2"
                  size={26}
                />
              </ListItemPrefix>
              {item.name}
              {item.subItems.length > 0 && (
                <div className="ml-auto">
                  {openIndex === index ? (
                    <AiOutlineCaretUp size={20} />
                  ) : (
                    <AiOutlineCaretDown size={20} />
                  )}
                </div>
              )}
            </ListItem>

            {item.subItems.length > 0 && openIndex === index && (
              <motion.div
                variants={subMenuVariants}
                initial="hidden"
                animate="visible"
                className="pl-6"
              >
                {item.subItems.map((subItem, subIndex) => (
                  <Link href={subItem.link} key={subIndex} passHref>
                    <ListItem className="cursor-pointer mr-10 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-gray-700 text-md font-ElMessiri">
                      {subItem.name}
                    </ListItem>
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </List>
    </Card>
  );
}
