"use client";
import withRoleProtection from "@/components/hoc/withRoleProtection";
import React from "react";

function layout({ children }) {
  return <>{children}</>;
}

export default withRoleProtection(layout, ["blood_agency"]);
