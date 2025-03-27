"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import UILoading from "@/components/UI/Loading";

export default function RegisterDetails({ params }) {
  // Dynamic import of components based on account type
  const AccountForm = React.useMemo(() => {
    switch (params.type) {
      case "charity":
        return dynamic(() => import("@/components/forms/CharityForm"));
      case "partner":
        return dynamic(() => import("@/components/forms/PartnerForm"));
      case "blood_agency":
        return dynamic(() => import("@/components/forms/BloodAgencyForm"));
      default:
        return notFound();
    }
  }, [params.type]);

  return (
    <Suspense fallback={<UILoading />}>
      <AccountForm />
    </Suspense>
  );
}
