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
      if (isAdmin && !pathname.startsWith("/admin") && pathname !== "/") {
        router.push("/not-found");
        return;
      }

      if (isReporter && !pathname.startsWith("/reporter") && pathname !== "/") {
        router.push("/not-found");
        return;
      }

      // Allow admins to access /admin and /, reporters to access /reporter and /
      if (
        (isAdmin && (pathname.startsWith("/admin") || pathname === "/")) ||
        (isReporter && (pathname.startsWith("/reporter") || pathname === "/"))
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
