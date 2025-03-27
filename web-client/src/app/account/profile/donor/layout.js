"use client";
import React from "react";
import Header from "./Header";
import Aside from "./Aside";
import withRoleProtection from "@/components/hoc/withRoleProtection";

function DonorLayout({ children }) {
  return (
    <div class="w-full grid grid-cols-1 sm:grid-cols-[1fr_1fr_0.5fr] auto-rows-auto gap-0">
      <div
        dir="rtl"
        class="col-span-1 sm:col-span-3 row-start-1 row-end-2  p-4"
      >
        <Header />
      </div>
      <div class="col-start-1 sm:col-start-3 col-span-1 row-start-2  p-4">
        <Aside />
      </div>
      <div class="col-start-1 sm:col-start-1 col-span-1 sm:col-span-2 row-start-3 sm:row-start-2  p-4">
        {children}
      </div>
    </div>
  );
}

export default withRoleProtection(DonorLayout, ["donor"]);
