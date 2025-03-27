"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";

import Typography from "@/components/UI/Typography";
import CONSTANTS from "@/config/constants";
import Tabs from "./Tabs";
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import SearchFilter from "./Search_Filter";

export default function layout({ children, params }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryParams = useSearchParams();
  const query = queryParams.get("query");
  // Debounce logic: wait until the user stops typing
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Update query params with debounced effect
  const updateQueryParams = useCallback(
    debounce((newKeywords) => {
      router.replace(`${pathname}?query=${query}&keywords=${newKeywords}`);
    }, 500), // Wait for 500ms
    [query, pathname, router]
  );

  const tabsData = CONSTANTS.DONATION_TAB_DATA.find(
    (item) => item.name === params.search
  );
  if (!tabsData) {
    return notFound();
  }
  return (
    <div className="p-5">
      <div dir="rtl" className="flex flex-col gap-4">
        <div className="w-full bg-mangoBlack p-10 rounded-md">
          <Typography variant="h3" className="font-ElMessiri">
            {tabsData.label}
          </Typography>
          <Typography variant="paragraph" className="font-ElMessiri">
            {tabsData.description}
          </Typography>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap gap-2 h-fit">
            {tabsData.data && (
              <Tabs
                curentTab={params.search}
                params={params}
                tabsData={tabsData}
              />
            )}
          </div>

          <SearchFilter
            handleChanges={(e) => updateQueryParams(e.target.value)}
            withFilter={true}
            submit={() => {}}
            query={query}
            search={params.search}
          />
        </div>
        <Suspense fallback="جاري التحميل...">{children}</Suspense>
      </div>
    </div>
  );
}
