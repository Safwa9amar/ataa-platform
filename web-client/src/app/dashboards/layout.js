"use client";
import { useCredentials } from "@/context/CredentialsContext";
import React from "react";
import Unauthorized from "../account/unauthorized/page";
import UILoading from "@/components/UI/Loading";

export default function layout({ children }) {
  const { isLoggedIn, loading } = useCredentials();

  if (loading) return <UILoading />;
  if (!loading && !isLoggedIn) {
    return <Unauthorized />;
  }
  if (!loading && isLoggedIn) {
    return children;
  }
}
