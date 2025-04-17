"use client";
import React, { Suspense, useCallback } from "react";

import Tabs from "./Tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchFilter from "./Search_Filter";
import { debounce } from "lodash";

export default function layout({ children, params }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryParams = useSearchParams();
  const status = queryParams.get("status");

  // Update query params with debounced effect
  const updateQueryParams = useCallback(
    debounce((newKeywords) => {
      router.replace(`${pathname}?status=${status}&keywords=${newKeywords}`);
    }, 500), // Wait for 500ms
    [pathname, router]
  );

  return (
    <div className="p-5 min-h-[50vh]">
      <div dir="rtl" className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between">
          <Tabs />
          <SearchFilter
            handleChanges={(e) => updateQueryParams(e.target.value)}
            submit={() => {}}
          />
        </div>
        <Suspense fallback="جاري التحميل...">{children}</Suspense>
      </div>
    </div>
  );
}
