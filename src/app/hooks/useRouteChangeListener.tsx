"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStoreState } from "./hooks"; // Adjust the path according to your project structure

export function RouteChangeListener() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isAuthenticated, isReporter } = useStoreState(
    (state) => state.auth
  );

  useEffect(() => {
    if (pathname == "/not-found") return;

    if (!isAuthenticated && pathname !== "/auth/login") {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      if (
        isReporter &&
        !pathname.startsWith("/reporter") &&
        pathname !== "/" &&
        pathname !== "/profile"
      ) {
        router.push("/not-found");
        return;
      }

      // Allow admins to access /admin and /, reporters to access /reporter and /
      if (
        isAdmin ||
        (isReporter &&
          (pathname.startsWith("/reporter") || pathname === "/")) ||
        pathname === "/profile"
      ) {
        // Valid route for the user's role, no redirect needed
        return;
      }

      // If none of the above conditions are met, send to not-found
      if (pathname !== "/not-found") {
        router.push("/not-found");
        return;
      }
    }
  }, [pathname, isAdmin, isAuthenticated, isReporter, router]);

  return null; // No UI to render
}
