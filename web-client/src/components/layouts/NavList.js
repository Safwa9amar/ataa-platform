"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCredentials } from "@/context/CredentialsContext";
import appRoutes from "../../config/appRoutes.json";
function NavList({ isScrolled, isHomePage }) {
  const { user, isLoggedIn } = useCredentials();
  const [activeItem, setActiveItem] = useState("");
  const [parentActive, setParentActve] = useState();
  const pathname = usePathname();

  // Filter routes based on user role and authentication requirements
  const getFilteredRoutes = () => {
    return appRoutes.filter((route) => {
      const role = user?.role || "";
      const roleAccess = isLoggedIn ? route[role] : !route.requireAuth;
      return roleAccess;
    });
  };

  const filteredRoutes = getFilteredRoutes();

  useEffect(() => {
    const currentPath = pathname;
    filteredRoutes.forEach(({ href, label }) => {
      if (currentPath === href) {
        setActiveItem(label);
      }
    });
  }, [pathname, filteredRoutes]);

  return (
    <ul
      dir="rtl"
      className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center"
    >
      {filteredRoutes.map(
        (
          { label, navListMenuItems, withMenu, href, icon, requireAuth },
          index
        ) => (
          <NavListMenu
            icon={icon}
            key={index}
            label={label}
            subItems={navListMenuItems}
            withMenu={withMenu}
            href={href}
            activeItem={activeItem}
            parentActive={parentActive}
            setActiveItem={setActiveItem}
            setParentActve={setParentActve}
            requireAuth={requireAuth}
            isHomePage={isHomePage}
            isScrolled={isScrolled}
          />
        )
      )}
    </ul>
  );
}

function NavListMenu({
  label,
  icon,
  subItems,
  withMenu,
  href,
  activeItem,
  parentActive,
  setActiveItem,
  setParentActve,
  requireAuth,
  isHomePage,
  isScrolled,
}) {
  const { isLoggedIn } = useCredentials();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user: { role },
  } = useCredentials();
  if (requireAuth && !isLoggedIn) {
    return null;
  }

  const renderItems = subItems
    .filter((item) =>
      isLoggedIn ? item[role] : !item.requireAuth || isLoggedIn
    )
    .map(({ title, href }, idx) => (
      <Link
        href={href}
        key={idx}
        onClick={() => {
          setParentActve(label);
          setActiveItem(title);
        }}
      >
        <MenuItem className="hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10">
          <Typography
            variant="paragraph"
            className={`text-white mb-1 md:text-md text-right font-ElMessiri ${
              activeItem === title ? "text-primaryColor" : ""
            }`}
          >
            {title}
          </Typography>
        </MenuItem>
      </Link>
    ));

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <Link
        href={href}
        className={`font-normal md:text-md lg:text-md ${
          parentActive === label ? "text-primaryColor" : ""
        }`}
        onClick={() => {
          setParentActve(label);
        }}
      >
        <MenuItem
          className={`text-textColor items-center gap-2 font-medium lg:flex font-ElMessiri ${
            parentActive === label
              ? "text-primaryColor"
              : isHomePage && !isScrolled
              ? "text-white"
              : ""
          }`}
        >
          {icon}
          {label}
          {withMenu && subItems.length > 0 && (
            <ChevronDownIcon
              strokeWidth={2}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </MenuItem>
      </Link>
      {withMenu && subItems.length > 0 && (
        <Menu open={isMenuOpen}>
          <MenuHandler>
            <div className="hidden lg:flex" />
          </MenuHandler>
          <MenuList className="absolute right-0 mt-2 w-60 shadow-lg bg-teal-600 border-gray-500 bg-opacity-55 backdrop-blur-md text-textColor rounded-lg">
            <ul className="flex flex-col gap-1">{renderItems}</ul>
          </MenuList>
        </Menu>
      )}
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
        <div className="border-b-2 border-borderColor" />
      </ul>
    </li>
  );
}

export default NavList;
