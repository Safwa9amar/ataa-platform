import React from "react";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  LifebuoyIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/solid";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import { MdOutlinePolicy } from "react-icons/md";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoPower } from "react-icons/io5";
import Link from "next/link";
import { useCredentials } from "@/context/CredentialsContext";
import { RiLoginCircleFill } from "react-icons/ri";

function ProfileMenu({ isScrolled, isHomePage }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { logout, user, isLoggedIn, loading } = useCredentials();

  const profileMenuItems = [
    {
      label: "حسابي",
      icon: UserCircleIcon,
      href: isLoggedIn
        ? user.role
          ? `/account/profile/${user.role}`
          : "/account/register/type"
        : "/account/login",
    },
    { label: "تواصل معنا", icon: InboxArrowDownIcon, href: "/contact-us" },
    { label: "الاسئلة الشائعة", icon: FaRegCircleQuestion, href: "/faq" },
    { label: "سياسة الخصوصية", icon: MdOutlinePolicy, href: "/privacy-policy" },
    { label: "مركز المساعدة", icon: LifebuoyIcon, href: "/help-center" },
    { label: "الفرص المحفوظة", icon: IoMdSave, href: "/saved-opportunities" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  // Render menu items
  const renderMenuItems = () =>
    profileMenuItems.map(({ label, icon, href }, index) => (
      <Link
        className={`flex items-center gap-2 py-2 px-4 hover:bg-teal-800 text-white font-ElMessiri`}
        key={label}
        href={href || "#"}
        passHref
      >
        {React.createElement(icon, {
          className: "h-5 w-5 text-gray-700 fill-white",
        })}

        {label}
      </Link>
    ));

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <button
          disabled={loading}
          className={`
          hover:bg-blue-gray-200 dark:hover:bg-gray-800 p-1 rounded-xl
          ${isHomePage && !isScrolled ? "text-white" : "text-teal-700"}  `}
          aria-label="Profile menu"
        >
          {isLoggedIn ? (
            <>
              <Avatar
                variant="circular"
                size="sm"
                alt={user?.name || "User"}
                src={
                  user?.photo
                    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.photo}`
                    : "/images/default-avatar.png"
                }
              />
            </>
          ) : loading ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <RiLoginCircleFill size={28} />
          )}
        </button>
      </MenuHandler>
      <MenuList
        dir="rtl"
        className="p-1 bg-teal-600 border-gray-500 bg-opacity-55 backdrop-blur-md text-textColor rounded-lg "
        aria-labelledby="Profile  menu"
      >
        {renderMenuItems()}
        {isLoggedIn && (
          <MenuItem
            onClick={() => {
              logout();
              closeMenu();
            }}
            className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
          >
            <IoPower className="h-5 w-5 text-red-500" />
            <Typography
              as="span"
              variant="small"
              className="font-normal text-red-500"
            >
              تسجيل الخروج
            </Typography>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default ProfileMenu;
