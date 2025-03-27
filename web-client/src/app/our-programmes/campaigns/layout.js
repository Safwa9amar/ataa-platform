"use client";
import React from "react";
import Navigation from "./Navigation";
import { useCredentials } from "@/context/CredentialsContext";

export default function RootLayout({ children }) {
  const { isLoggedIn } = useCredentials();

  return (
    <>
      {isLoggedIn && <Navigation />}
      {children}
    </>
  );
}
