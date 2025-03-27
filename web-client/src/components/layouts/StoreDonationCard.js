import React from "react";
import { motion } from "framer-motion";
import { Chip, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import { useSavedStoreOpportunities } from "@/context/SavedStoreOpportunitiesContext";
import { FaHeart } from "react-icons/fa6";
import { IoHeartOutline, IoShareSocial } from "react-icons/io5";
import { useShare } from "@/context/ShareContext";
import { useCart } from "@/context/CartContext";
import CONSTANTS from "@/config/constants";
import { BiCart } from "react-icons/bi";
import { useCredentials } from "@/context/CredentialsContext";

const StoreDonationCard = ({
  id,
  image,
  badgeColor,
  badgeTitle,
  title,
  description,
  remainingAmount,
  width = 300,
  customStyles = {},
  isLoading = false,
  onClick,
}) => {
  const { user } = useCredentials();
  const { toggleSaveStoreOpportunity, isStoreOpportunitySaved } =
    useSavedStoreOpportunities();
  const { openShareModal } = useShare();
  const { addToCart, isInCart } = useCart();
  const isSaved = isStoreOpportunitySaved(id);

  if (isLoading) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg shadow-lg min-h-[450px] w-[${width}px] bg-gray-100 animate-pulse ${customStyles}`}
      >
        {/* Save Button Placeholder */}
        <div className="absolute top-6 left-5 z-30 flex gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>

        {/* Image Placeholder */}
        <div className="w-full h-[60%] bg-gray-300"></div>

        {/* Content Placeholder */}
        <div className="p-4 flex flex-col gap-4">
          {/* Title Placeholder */}
          <div className="h-6 w-3/4 bg-gray-300 rounded"></div>

          {/* Description Placeholder */}
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>

          {/* Remaining Amount Placeholder */}
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>

          {/* Badge Placeholder */}
          <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg shadow-lg min-h-[450px] group`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Save Button */}
      <div className="absolute  top-6 left-5 z-30 p-2 flex items-center gap-3 ">
        {user?.role === "donor" && (
          <IconButton
            disabled={isInCart(id)}
            size="sm"
            color="green"
            onClick={() =>
              addToCart({
                id,
                image,
                title,
                screen: "DonationCardDetails",
                type: CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY,
                priceEditable: true,
                price: 0,
              })
            }
            variant="outlined"
          >
            <BiCart size={26} />
          </IconButton>
        )}
        <IconButton
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            toggleSaveStoreOpportunity({ id, image, title, description });
          }}
          color={isSaved ? "red" : "green"}
          variant={isSaved ? "gradient" : "outlined"}
          aria-label={isSaved ? "Remove from saved" : "Save to store"}
        >
          {isSaved ? <FaHeart size={26} /> : <IoHeartOutline size={28} />}
        </IconButton>

        <IconButton
          size="sm"
          color="green"
          onClick={() =>
            openShareModal({
              url:
                window.location.host + `/donations-store/oppertunities/${id}`,
              title: title,
              userId: user.id,
              type: "donationOpportunity",
              itemId: id,
            })
          }
          variant="outlined"
        >
          <IoShareSocial size={26} />
        </IconButton>
      </div>
      <div onClick={onClick} className="w-full h-full relative">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="w-full h-full rounded-lg object-cover"
        />

        {/* Hover Content */}
        <Link
          href={`/donations-store/oppertunities/${id}`}
          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-4 rounded-lg text-right flex flex-col items-start gap-4 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
        >
          <h1 className="text-blue-gray-100 text-xl">{title}</h1>
          <p className="text-gray-200">{description}</p>
          <p className="text-white mt-2">
            عدد الوحدات المتبقية: {remainingAmount}
          </p>
          <Chip
            className="rounded-full w-fit"
            color={badgeColor || "indigo"}
            value={badgeTitle}
          />
        </Link>

        {/* Default Title */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-4 rounded-lg text-right flex flex-col items-start gap-4 group-hover:opacity-0 transition-opacity duration-300 ease-in-out">
          <h1 className="text-blue-gray-100 text-xl">{title}</h1>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreDonationCard;
