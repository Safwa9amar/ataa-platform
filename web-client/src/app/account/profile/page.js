"use client";
import withRegistrationStatus from "@/components/hoc/withRegistrationStatus";
import { useCredentials } from "@/context/CredentialsContext";
import useUpdateAddressForm from "@/hooks/useUpdateAddressForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function page() {
  const { user, isLoggedIn, loading } = useCredentials();
  const router = useRouter();
  const openAddressSwal = useUpdateAddressForm();
  const { address, role } = user;

  useEffect(() => {
    if (loading) return;
    if (!address && role === "donor") {
      return openAddressSwal();
    }
    if (isLoggedIn && role) {
      router.replace(`/account/profile/${role}`);
    } else {
      router.replace(`/account/login`);
    }
  }, [role, address, isLoggedIn]);
  return null;
}
export default withRegistrationStatus(page);
