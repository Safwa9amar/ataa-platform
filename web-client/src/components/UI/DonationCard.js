"use client";

import { motion } from "framer-motion";
import { RiShareFill } from "react-icons/ri";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
  Progress,
  Input,
  ButtonGroup,
} from "@material-tailwind/react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useSavedDonationOpportunities } from "@/context/SavedDonationOpportunitiesContext";
import { useCart } from "@/context/CartContext";
import { useShare } from "@/context/ShareContext";
import CONSTANTS from "@/config/constants";
import { useCredentials } from "@/context/CredentialsContext";
import API_ENDPOINTS from "@/config/apiEndPoints";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FcExternal } from "react-icons/fc";
import { BiLink } from "react-icons/bi";

// Motion Variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.05 },
};

const buttonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3 } },
};

export function DonationCard({ data }) {
  const { user } = useCredentials();
  const { toggleSaveOpportunity, isOpportunitySaved } =
    useSavedDonationOpportunities();
  const { loading, addToCart, isInCart } = useCart();
  const { openShareModal } = useShare();
  const [price, setPrice] = useState("");

  const isSaved = useMemo(
    () => isOpportunitySaved(data.id),
    [data.id, isOpportunitySaved]
  );
  const inCart = useMemo(() => isInCart(data.id), [data.id, isInCart]);
  const isCompleted = data?.progress?.rate >= 100;

  return (
    <Link href={`/donation-opportunity?id=${data.id}`}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="w-full max-w-[26rem]"
      >
        <Card className="bg-mangoBlack h-full rounded-lg shadow-md" dir="rtl">
          {/* Card Header */}
          <CardHeader floated={false} className="relative h-52">
            <motion.img
              src={`${API_ENDPOINTS.UPLOADS}/${data.images?.[0]?.filename}`}
              alt="Donation Opportunity"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <ButtonGroup
              dir="ltr"
              className="absolute top-4 left-4"
              color="teal"
              onClick={(e) => {
                e.preventDefault(); // منع انتشار الحدث
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.preventDefault(); // منع انتشار الحدث للنقر على الرابط
                  openShareModal({
                    url: `${window.location.host}/donation-opportunity?id=${data.id}`,
                    title: data.title,
                    userId: user.id,
                    type: "donationOpportunity",
                    itemId: data.id,
                  });
                }}
              >
                <RiShareFill size={24} />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.preventDefault(); // منع انتشار الحدث
                  toggleSaveOpportunity(data);
                }}
              >
                {isSaved ? <FaHeart size={24} /> : <IoHeartOutline size={24} />}
              </IconButton>

              <IconButton
                loading={loading}
                disabled={inCart || isCompleted}
                onClick={(e) => {
                  e.preventDefault(); // منع انتشار الحدث
                  addToCart({
                    ...data,
                    screen: "DonationCardDetails",
                    type: CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY,
                    priceEditable: true,
                    price: parseFloat(price) || 0,
                  });
                }}
              >
                <IoCartOutline color="white" size={24} />
              </IconButton>
            </ButtonGroup>
          </CardHeader>

          {/* Card Body */}
          <CardBody>
            <Progress
              className="my-2"
              color="cyan"
              value={data?.progress?.rate || 0}
              label=" "
            />
            <Typography
              variant="h5"
              className="font-medium text-gray-800 dark:text-gray-100 mb-2 truncate font-ElMessiri"
            >
              {data?.title}
            </Typography>
            <Typography
              color="gray"
              className="dark:text-gray-300 text-sm font-ElMessiri"
            >
              {data?.description}
            </Typography>
          </CardBody>

          {/* Card Footer */}
          <CardFooter className="pt-3">
            {user?.role === CONSTANTS.USERS_ROLES.donor && (
              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-3"
              >
                {/* {!isCompleted && (
                  <Input
                    type="number"
                    variant="standard"
                    label="أدخل مبلغ التبرع"
                    placeholder="أدخل مبلغ التبرع"
                    disabled={inCart}
                    onChange={(e) => {
                      e.stopPropagation(); // منع انتشار الحدث
                      setPrice(e.target.value);
                    }}
                    className="w-full text-gray-700 dark:text-gray-200"
                  />
                )} */}

                {!isCompleted && (
                  <div className="w-full gap-3">
                    <Link
                      className="bg-teal-400 dark:bg-teal-700 font-ElMessiri w-full rounded-full h-8 flex items-center justify-center text-white"
                      href={`/donate-now?type=${
                        CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY
                      }&id=${data.id}&price=${parseFloat(price) || 0}`}
                    >
                      {data?.category?.title === "kafalat"
                        ? "اكفلني"
                        : "تبرع الآن"}
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}

export function DonationCardSkeleton() {
  return (
    <motion.div
      className="w-full max-w-[26rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="bg-mangoBlack h-full rounded-lg shadow-md" dir="rtl">
        {/* Card Header */}
        <CardHeader floated={false} className="relative h-52">
          <Skeleton height={208} className="w-full h-full" />
        </CardHeader>

        {/* Card Body */}
        <CardBody>
          <Skeleton height={10} className="my-2" />
          <Skeleton height={20} width="80%" className="mb-2" />
          <Skeleton count={2} height={14} width="100%" />
        </CardBody>

        {/* Card Footer */}
        <CardFooter className="pt-3">
          <div className="flex flex-wrap gap-3">
            <Skeleton height={40} width="100%" />
            <div className="grid grid-cols-2 gap-3 w-full">
              <Skeleton height={32} />
              <Skeleton height={32} />
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
