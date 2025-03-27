"use client";
import { useEffect } from "react";
import { useCredentials } from "@/context/CredentialsContext"; // Context to fetch user info
import { useRouter } from "next/navigation";

const withRegistrationStatus = (WrappedComponent) => {
  return (props) => {
    const { user, isLoggedIn, loading } = useCredentials();
    const router = useRouter();

    if (!isLoggedIn) {
      // Redirect to login if not logged in
      router.replace("/account/login");
      return;
    }

    useEffect(() => {
      if (!loading) {
        // Check the user's registration status and redirect accordingly
        switch (user?.registrationStatus) {
          case "CREATED":
            router.replace(`/account/password-reset?email=${user.email}`);
            break;
          case "VERIFIED":
            router.replace("/account/register/type");
            break;
          case "COMPLETED":
            // Allow access to the wrapped component
            // router.replace(`/account/profile/${user?.role}`);
            // router.replace(`/`);
            break;
          default:
            router.replace("/account/unauthorized"); // Redirect for unknown status
            break;
        }
      }
    }, [isLoggedIn, user?.registrationStatus, loading]);

    // Render the wrapped component if the user has completed registration
    return <WrappedComponent {...props} />;
  };
};

export default withRegistrationStatus;
