"use client";

import { Typography } from "@material-tailwind/react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { GooglePlayDownload } from "../UI/GooglePlayDownload";
import { motion } from "framer-motion";
import Image from "next/image";

const LINKS = [
  {
    title: "الشركة",
    items: [
      { title: "من نحن", link: "/about-us" },
      { title: "المدونة", link: "/blog" },
      { title: "اللجنة الشرعية", link: "/sharia-committee" },
      { title: "رسوم المنصة", link: "#" },
    ],
  },
  {
    title: "المصادر",
    items: [
      { title: "مركز المساعدة", link: "/help-center" },
      { title: "الاسئلة الشائعة", link: "/faq" },
      { title: "سياسة الخصوصية", link: "/privacy-policy" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export function FooterWithSocialLinks() {
  const renderLinks = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {LINKS.map(({ title, items }) => (
        <ul key={title} className="space-y-3">
          <Typography
            variant="h4"
            color="blue-gray"
            className="font-ReemKufi mb-4 text-textColor font-bold text-lg"
          >
            {title}
          </Typography>
          {items.map((item) => (
            <li key={item.link}>
              <Typography
                as="a"
                href={item.link}
                color="gray"
                className="font-ElMessiri py-1.5 font-normal text-textColor hover:text-blue-500 transition-colors duration-300 ease-in-out"
              >
                {item.title}
              </Typography>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );

  return (
    <motion.footer
      dir="rtl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full bg-nav_bg text-textColor rounded-lg p-10 shadow-lg border-2 border-borderColor"
    >
      <div className="mx-auto w-full max-w-7xl px-8 flex flex-col items-center text-center md:text-right md:items-start">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 w-full">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 flex flex-col items-center md:items-start"
          >
            <Image
              src="/logo/fullLogo.png" // تأكد أن الشعار موجود في public/logo.png
              alt="Logo"
              width={220}
              height={220}
              className="rounded-md"
            />
            <GooglePlayDownload />
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {renderLinks()}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex flex-col items-center border-t w-full border-borderColor pt-6 md:flex-row md:justify-between"
        >
          <p className="text-md md:text-lg font-ReemKufi">
            &copy; {currentYear} منصة عطاء. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-500 hover:text-blue-700 transition-transform duration-300 transform hover:scale-110"
            >
              <FaFacebook size={32} />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-gray-500 hover:text-black transition-transform duration-300 transform hover:scale-110"
            >
              <FaTiktok size={32} />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-500 hover:text-pink-500 transition-transform duration-300 transform hover:scale-110"
            >
              <FaInstagram size={32} />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
