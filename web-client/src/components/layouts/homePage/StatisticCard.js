"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaCaretUp } from "react-icons/fa6";

const StatisticCard = ({
  title,
  value = 0,
  icon,
  color = "#4CAF50", // لون افتراضي
  ratio,
  duration = 0.5,
}) => {
  return (
    <motion.div
      dir="rtl"
      className="w-full h-36 md:h-40 flex items-center gap-5 p-6 bg-mangoBlack rounded-lg shadow-md border border-borderColor transition-transform transform hover:scale-105 hover:shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: duration, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.6 }} // Trigger once when 60% of the card is in view
    >
      {/* أيقونة الإحصائية */}
      <div className=" w-16 md:w-20 h-16 md:h-20 md:hidden lg:flex justify-center items-center bg-gray-100 dark:bg-gray-900 rounded-full p-2">
        <Image
          src={icon}
          alt={title}
          width={50}
          height={50}
          className="object-contain"
        />
      </div>

      {/* محتوى الإحصائية */}
      <div className="flex flex-col items-start justify-center flex-1">
        {/* القيمة */}
        <p className="text-2xl md:text-xl xl:text-3xl font-bold text-green-800">
          {value}
        </p>

        {/* العنوان */}
        <p className="text-sm md:text-lg text-gray-800 dark:text-gray-50 ">
          {title}
        </p>

        {/* نسبة التغيير */}
        <div className="flex items-center gap-1 mt-2 text-sm">
          <FaCaretUp size={16} color={color} />
          <span className="font-semibold" style={{ color: color }}>
            {ratio}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
