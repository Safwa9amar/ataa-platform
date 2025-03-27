"use client";
import UILoading from "@/components/UI/Loading";
import CONSTANTS from "@/config/constants";
import dynamic from "next/dynamic";
import { notFound, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

// Loading fallback component

export default function DonationTypeRenderer() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const paymentMethod = searchParams.get("payment-methode");

  const ComponentToRender = React.useMemo(() => {
    switch (type) {
      case CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY:
        return dynamic(() => import("./DonationOpportunity"));
      case CONSTANTS.DONATION_TYPES.CAMPAIGN:
        return dynamic(() => import("./Campaign"));
      case CONSTANTS.DONATION_TYPES.ZAKAT:
        return dynamic(() => import("./Zakat"));
      case CONSTANTS.DONATION_TYPES.STORE:
        return dynamic(() => import("./Store"));
      case CONSTANTS.DONATION_TYPES.CART:
        return dynamic(() => import("./Cart"));
      case CONSTANTS.DONATION_TYPES.ORPHAN:
        return dynamic(() => import("./DonationOpportunity"));
      default:
        return notFound();
    }
  }, [type]);

  return (
    <Suspense fallback={<UILoading />}>
      <ComponentToRender id={id} paymentMethod={paymentMethod} />
    </Suspense>
  );
}
