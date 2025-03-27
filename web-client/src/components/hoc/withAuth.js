"use client";
import { useRouter } from "next/navigation"; // ✅ التصحيح هنا
import { useEffect } from "react";
import { useCredentials } from "@/context/CredentialsContext";
import UILoading from "../UI/Loading";

// HOC to protect routes
const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isLoggedIn, user, loading } = useCredentials();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user && !isLoggedIn) {
        // Redirect to login if the user is not logged in
        router.push("/account/login");
      }
    }, [user, loading, isLoggedIn, router]); // ✅ أضفت `isLoggedIn` للتأكد من تحديث القيم عند التغيير

    // While loading, show a spinner or placeholder
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <UILoading />
        </div>
      );
    }

    // If logged in, render the protected component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
