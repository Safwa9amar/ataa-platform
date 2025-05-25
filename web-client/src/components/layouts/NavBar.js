"use client";
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Drawer,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Badge,
} from "@material-tailwind/react";
import { Bars2Icon } from "@heroicons/react/24/solid";
import ProfileMenu from "./ProfileMenu";
import NavList from "./NavList";
import DarkLightToggle from "../UI/DarkLightToggle";
import Image from "next/image";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import { PiBellSimpleRingingFill } from "react-icons/pi";
import { useNotifications } from "@/context/NotificationContext";
import { useCart } from "@/context/CartContext";
import { useCredentials } from "@/context/CredentialsContext";
import CONSTANTS from "@/config/constants";
import SearchWithMenu from "../UI/SearchWithMenu";
import { usePathname, useRouter } from "next/navigation";
import NotificationDropdown from "./NotificationsDropdown";
import { GrCart } from "react-icons/gr";
import BreadcrumbsWithIcon from "./BreadcrumbsWithIcon";
import FastDonationModal from "../modal/FastDonation";

const searchItems = ["فرص التبرع", "الحملات", "منتجات المتجر"];

export function ComplexNavbar() {
  const { user, isLoggedIn } = useCredentials();
  const { cart } = useCart();
  const { notifications, markAsRead } = useNotifications();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openNotificationMenu, setOpenNotificationMenu] = useState();
  const [keyword, setKeyword] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll position
  const toggleIsNavOpen = () => setIsDrawerOpen((cur) => !cur);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const hideSearchBar =
    ["/our-programmes/campaigns/", "/our-programmes/blood-donation"].some(
      (el) => pathname.startsWith(el)
    ) || user.role !== "donor";

  const handleSearch = () => {
    // check selectedMenuItem and navigate to the correct page
    for (let item of searchItems) {
      if (selectedMenuItem === item) {
        if (item === "فرص التبرع") {
          router.push(`/donation-opportunities?search=${keyword}`);
        } else if (item === "الحملات") {
          router.push(
            `/our-programmes/campaigns/users-campaigns?keywords=${keyword}&status=all`
          );
        } else if (item === "منتجات المتجر") {
          router.push(`/donations-store/products?search=${keyword}`);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsDrawerOpen(false)
    );

    // Listen to the scroll event and set the background change
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Change navbar bg when scrolled down more than 50px
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, []);

  return (
    <>
      <nav
        className={`${
          isHomePage
            ? isScrolled
              ? "fixed bg-background backdrop-blur-md"
              : "fixed py-2 px-2 md:py-10 md:px-10 backdrop-blur-md "
            : "sticky bg-background border-t-0 dark:border-0 border-2 text-textColor border-borderColor shadow-sm"
        } top-0 z-50 flex justify-between items-center w-full p-4  rounded-b-xl dark:rounded-none transition-all `}
      >
        <div className="flex items-center gap-2">
          <ProfileMenu isScrolled={isScrolled} isHomePage={isHomePage} />
          {isLoggedIn ? (
            <NotificationDropdown
              isScrolled={isScrolled}
              isHomePage={isHomePage}
            />
          ) : (
            <DarkLightToggle isScrolled={isScrolled} isHomePage={isHomePage} />
          )}
          <FastDonationModal isScrolled={isScrolled} isHomePage={isHomePage} />
        </div>
        <div className="hidden md:block">
          {!hideSearchBar && (
            <SearchWithMenu
              menuItems={
                isLoggedIn && user.role === CONSTANTS.USERS_ROLES.donor
                  ? searchItems
                  : []
              }
              inputValue={keyword}
              placeholder="بحث عن فرص تبرع، حملات..."
              onMenuItemClick={setSelectedMenuItem}
              onInputChange={setKeyword}
              onSearch={handleSearch}
            />
          )}
        </div>

        <div className="relative flex items-center justify-between text-white">
          <div className="hidden lg:block">
            <NavList isScrolled={isScrolled} isHomePage={isHomePage} />
          </div>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-2 lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>

          <Link href={"/"}>
            <Image
              width={200}
              height={200}
              src={"/logo/logo.png"}
              alt="logo"
              className="w-8 h-4 lg:w-14 lg:h-6"
            />
          </Link>
        </div>
      </nav>
      {!isHomePage && (
        <div className="bg-background border-b border-b-borderColor dark:border-b-0 w-full flex justify-between items-center">
          <div className="flex items-center md:px-10">
            {isLoggedIn && user.role === CONSTANTS.USERS_ROLES.donor && (
              <>
                <Link
                  href={"/cart"}
                  className="relative px-1 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800"
                >
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 text-white w-5 h-5 text-xs flex justify-center items-center text-center bg-red-600 rounded-full p-2">
                      {cart.length || 0}
                    </span>
                  )}
                  <GrCart
                    className={`text-secondaryColor ${
                      isHomePage && !isScrolled
                        ? "stroke-white "
                        : "stroke-teal-700"
                    }`}
                    size={25}
                  />
                </Link>
              </>
            )}
            {isLoggedIn && (
              <DarkLightToggle
                isScrolled={isScrolled}
                isHomePage={isHomePage}
              />
            )}
          </div>
          <BreadcrumbsWithIcon />
        </div>
      )}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className={`p-4 lg:hidden bg-nav_bg`}
      >
        <NavList />
      </Drawer>
    </>
  );
}
