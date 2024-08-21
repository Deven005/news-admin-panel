"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../hooks/hooks";
import Image from "next/image";

const MyNavBar = () => {
  const { logout } = useStoreActions((state) => state.auth);
  const { isAdmin, isReporter, isAuthenticated } = useStoreState(
    (state) => state.auth
  );
  const { listenChangeNews } = useStoreActions((state) => state.news);
  const { listenPlaceChange } = useStoreActions(
    (state) => state.historicalPlace
  );
  const { listenTalukasChange } = useStoreActions((state) => state.taluka);

  useEffect(() => {
    if (isAdmin) {
      listenChangeNews();
      listenPlaceChange();
      listenTalukasChange();
    }
  }, []);

  const getUserLinks = () => {
    if (isAdmin) {
      return [
        { href: "/admin/taluka", label: "Taluka" },
        { href: "/admin/content-management", label: "Content Management" },
        { href: "/admin/business", label: "Business" },
        // { href: "/admin/reporter", label: "Reporter" },
        // { href: "/admin/historical-places", label: "Historical Places" },
        // { href: "/admin/admin", label: "Admins" },
        { href: "/admin/users", label: "User Management" },
      ];
    } else if (isReporter) {
      return [{ href: "/reporter/news", label: "News" }];
    }
    return [];
  };

  const userLinks = getUserLinks();

  return isAuthenticated ? (
    <nav className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {userLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          {isAdmin ? "Admin" : isReporter ? "Reporter" : ""} Panel
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {userLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <Image
                alt="User Avatar"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                className="object-cover"
                height={100}
                width={100}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <p
                onClick={() => logout(null)}
                className="cursor-pointer text-red-600"
              >
                Logout
              </p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  ) : null;
};

export default MyNavBar;
