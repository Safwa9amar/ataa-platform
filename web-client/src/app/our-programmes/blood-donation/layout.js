"use client";
import React from "react";
import Navigation from "./Navigation";
import { useCredentials } from "@/context/CredentialsContext";
import { usePathname } from "next/navigation";

export default function layout({ children }) {
  const { isLoggedIn } = useCredentials();
  const pathname = usePathname();
  return (
    <>
      {isLoggedIn && <Navigation />}
      {children}
    </>
  );
}
