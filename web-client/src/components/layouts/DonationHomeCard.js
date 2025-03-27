import { motion } from "framer-motion";
import useScrollToTop from "@/hooks/useScrollToTop";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoLinkExternal } from "react-icons/go";

export default function DonationHomeCard({
  id,
  image,
  category,
  badgeColor,
  badgeTitle,
  title,
  remainingAmount,
  styles,
}) {
  const scrollToTop = useScrollToTop();
  const router = useRouter();

  return (
    <motion.div
      onClick={() => {
        router.push(`/donation-opportunity?id=${id}`);
        scrollToTop();
      }}
      dir="rtl"
      className="relative m-4 w-full rounded-3xl border-2 border-borderColor overflow-hidden cursor-pointer"
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <motion.div
        className="relative w-full h-56"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Image
          width={200}
          height={350}
          src={image}
          alt="Donation"
          className="w-full h-full object-cover rounded-t-3xl"
        />
      </motion.div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute flex flex-col justify-between items-end text-center bottom-0 w-full h-full bg-gray-900 bg-opacity-75 p-5 space-y-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-block px-3 py-1 text-black text-sm rounded-xl"
          style={{ backgroundColor: badgeColor || "white" }}
          whileHover={{ scale: 1.1 }}
        >
          {badgeTitle}
        </motion.div>

        {/* External Link Icon */}
        <motion.div
          className="bg-white p-2 rounded-full absolute top-2 right-5"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <GoLinkExternal color="black" size={20} />
        </motion.div>

        {/* Title and Remaining Amount */}
        <motion.div
          className="self-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <p className="text-white text-lg font-bold">{title}</p>
          <p className="text-white text-sm">
            المبلغ المتبقي : {remainingAmount} دج
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
