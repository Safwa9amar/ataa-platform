"use client";
import React, { useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useCredentials } from "@/context/CredentialsContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function GoogleLoginComponent() {
  const { loginWithGoogle, isLoggedIn } = useCredentials();

  const handleSuccess = (credentialResponse) => {
    try {
      credentialResponse &&
        Swal.fire({
          title: "google account login",
          text: "تم تسجيل الدخول بحساب قوقل بنجاح",
          icon: "success",
        });
      loginWithGoogle(credentialResponse);
    } catch (error) {
      console.error("Error decoding Google token:", error);
    }
  };

  const handleError = () => {
    toast.error("حدث خطأ ما يرجى اعادة المحاولة", {
      position: "bottom-left",
      toastId: 1,
    });
  };
  if (isLoggedIn) return;
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      shape="circle"
      theme="outline"
      type="standard"
      logo_alignment="left"
    />
  );
}
