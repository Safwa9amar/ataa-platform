"use client";
import { Typography as MTTypography } from "@material-tailwind/react";
import React from "react";

export default function Typography(props) {
  return <MTTypography {...props}>{props.children}</MTTypography>;
}
