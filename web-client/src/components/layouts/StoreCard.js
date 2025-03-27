import React from "react";
import { motion } from "framer-motion";
import { Button, IconButton } from "@material-tailwind/react";
import { BiCartAdd } from "react-icons/bi";
import { useCart } from "@/context/CartContext";
import { useCredentials } from "@/context/CredentialsContext";

const StoreCard = ({ id, title, price, image, handlePress }) => {
  const { user } = useCredentials();

  const { isInCart } = useCart();

  return (
    <motion.div
      className="relative flex flex-col bg-mangoBlack rounded-lg shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 w-full sm:w-[300px] max-w-xs"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-3 bg-gray-600 dark:bg-gray-800 text-gray-100">
        {/* Title and Price */}
        <h3 className="text-lg font-semibold  truncate">{title}</h3>
        <p className="text-sm  mt-2">{price} دج</p>
        {/* Actions */}
        {user.role === "donor" && (
          <Button
            disabled={isInCart(id)}
            color="green"
            className="flex items-center justify-center gap-2 text-white  text-sm px-4 py-2 rounded-md shadow-md"
            onClick={handlePress}
          >
            أضف إلى السلة
            <BiCartAdd size={20} />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export const ProductCardStoreSkeletonLoader = () => {
  return (
    <div className="relative flex flex-col bg-gray-200 rounded-lg shadow-md overflow-hidden w-full sm:w-[300px] max-w-xs animate-pulse">
      {/* Skeleton Image */}
      <div className="w-full h-48 bg-gray-300"></div>
      {/* Skeleton Content */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mt-4"></div>
      </div>
    </div>
  );
};

export default StoreCard;
