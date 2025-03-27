"use client";
import { Button } from "@material-tailwind/react";
import React from "react";

export default function ButtonTab({
  props,
  name,
  handleClick,
  label,
  active,
  icon,
}) {
  return (
    <Button
      key={name}
      onClick={handleClick}
      className={`${
        active ? "bg-blue-800 text-white" : "bg-mangoBlack text-textColor"
      } md:text-md w-24 md:w-40 flex items-center justify-center rounded-full gap-2`}
    >
      {label}
      {icon}
    </Button>
  );
}
