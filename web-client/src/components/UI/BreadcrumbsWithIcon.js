// /components/DynamicBreadcrumbsWithIcon.js
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@material-tailwind/react";

const DynamicBreadcrumbsWithIcon = ({
  homeElement,
  separator,
  containerClasses = "",
  listClasses = "opacity-60",
  activeClasses = "text-blue-600",
  capitalizeLinks = true,
}) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumbs 
    dir="rtl"
    className={containerClasses}>
      {/* Home Element */}
      <Link href="/" className={listClasses}>
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          {homeElement}
        </span>
      </Link>

      {/* Dynamic Pathnames */}
      {pathNames.map((link, index) => {
        const href = `/${pathNames.slice(0, index + 1).join("/")}`;
        const itemClasses =
          paths === href ? `${listClasses} ${activeClasses}` : listClasses;
        const itemLink = capitalizeLinks
          ? link[0].toUpperCase() + link.slice(1)
          : link;

        return (
          <React.Fragment key={index}>
            <Link href={href} className={itemClasses}>
              {itemLink}
            </Link>
            {pathNames.length !== index + 1 && separator}
          </React.Fragment>
        );
      })}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbsWithIcon;
