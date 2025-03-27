"use client";

import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import APP_ROUTES from "../../config/breadcrumbs.json";

export function BreadcrumbsWithIcon() {
  const pathname = usePathname();

  // Helper to find breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentPath = "";

    // Split the pathname into segments
    const pathSegments = pathname.split("/").filter(Boolean);

    // Loop through each segment and find matching labels
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Find the matching route in APP_ROUTES
      const matchedRoute = APP_ROUTES.find(
        (route) => route.pathname === currentPath
      );

      if (matchedRoute) {
        breadcrumbs.push({
          label: matchedRoute.label,
          href: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex justify-end">
      <Breadcrumbs
        className="bg-nav_bg shadow-md border-2 border-borderColor dark:border-0 my-4"
        dir="rtl"
      >
        {/* Home icon */}
        <Link href="/" className="dark:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </Link>
        {/* Dynamic Breadcrumb Items */}
        {breadcrumbs.map(({ label, href }, index) => (
          <Link
            key={index}
            href={href}
            className={`${
              index === breadcrumbs.length - 1 ? "" : "opacity-60"
            } dark:text-white`}
          >
            {label}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}

export default BreadcrumbsWithIcon;
