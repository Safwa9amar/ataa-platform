"use client";
import { useCredentials } from "@/context/CredentialsContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import UILoading from "../UI/Loading";

/**
 * A higher-order component to protect routes based on user role.
 * @param {React.ComponentType} WrappedComponent - The component to wrap and protect.
 * @param {string[]} allowedRoles - List of roles allowed to access this component.
 */
const withRoleProtection = (WrappedComponent, allowedRoles) => {
  return function RoleProtectedComponent(props) {
    const { user, isLoggedIn, loading } = useCredentials();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const timer = useRef();
    // if (loading) return;

    useEffect(() => {
      // If not logged in, redirect to the login page
      if (!isLoggedIn) {
        timer.current = setTimeout(() => {
          router.replace("/account/login");
        }, 2000);
        return;
      }

      // If the user's role is not in the allowed roles, redirect to unauthorized
      if (!allowedRoles.includes(user?.role)) {
        router.replace("/account/unauthorized");
        return;
      }

      // User is authorized
      setIsAuthorized(true);
      return clearTimeout(timer.current);
    }, [isLoggedIn, user.role, allowedRoles, router]);

    // Show a loading spinner while checking authorization
    if (!isAuthorized) {
      return <UILoading />;
    }

    // Render the wrapped component if authorized
    return <WrappedComponent {...props} />;
  };
};

export default withRoleProtection;
