"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "../hooks/hooks";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const MyNavBar = () => {
  const pathname = usePathname();
  const { logout } = useStoreActions((state) => state.auth);
  const { isAdmin, isReporter, isAuthenticated } = useStoreState(
    (state) => state.auth
  );
  const { listenChangeNews, listenChangeNewsForReporter } = useStoreActions(
    (state) => state.news
  );
  const { listenPlaceChange } = useStoreActions(
    (state) => state.historicalPlace
  );
  const { listenTalukasChange } = useStoreActions((state) => state.taluka);
  const { listenStoreChange } = useStoreActions((actions) => actions.store);
  const { fetchUsers } = useStoreActions((actions) => actions.user);
  const { getAdmins } = useStoreActions((states) => states.admin);
  const { listenToReporters } = useStoreActions((state) => state.reporter);
  const { listenEmergencyContacts } = useStoreActions(
    (state) => state.emergencyContacts
  );
  const { listenFAQs } = useStoreActions((actions) => actions.faqs);
  const { listenRequirementCategories, listenPostRequirements } =
    useStoreActions((actions) => actions.requirements);
  const { listenStatusCategories, listenStatuses } = useStoreActions(
    (actions) => actions.status
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    if (isAdmin) {
      listenTalukasChange();
      listenChangeNews();
      listenPlaceChange();
      listenStoreChange();
      listenToReporters();
      listenEmergencyContacts();
      listenRequirementCategories();
      listenPostRequirements();
      listenStatusCategories();
      listenFAQs();
      listenStatuses();
      fetchUsers();
      getAdmins();
    } else if (isReporter) {
      listenTalukasChange();
      listenChangeNewsForReporter();
    }
  }, [isAdmin, isReporter, isAuthenticated]);

  const getUserLinks = () => {
    if (isAdmin) {
      return [
        { href: "/admin/content-management", label: "Content Management" },
        { href: "/admin/categories", label: "Categories" },
        { href: "/admin/users", label: "User Management" },
        { href: "/admin/location", label: "Location Management" },
        {
          href: "/admin/communication-faqs",
          label: "Communication Management & FAQs",
        },
        {
          href: "/admin/statuses-requirements",
          label: "Statuses & Requirements",
        },
        { href: "/profile", label: "Profile" },
      ];
    } else if (isReporter) {
      return [
        { href: "/reporter", label: "News" },
        { href: "/profile", label: "Profile" },
      ];
    }
    return [];
  };

  const userLinks = getUserLinks();
  const [activeLink, setActiveLink] = useState<string>(pathname);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  return isAuthenticated ? (
    <nav className="navbar bg-base-100 shadow-md border-b border-gray-200">
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 transition-transform transform-gpu"
          >
            {userLinks.map((link) => (
              <li
                key={link.href}
                className={activeLink === link.href ? "bg-gray-200" : ""}
              >
                <Link
                  href={link.href}
                  className={
                    activeLink === link.href
                      ? "text-blue-600 font-semibold"
                      : ""
                  }
                >
                  {link.label}
                </Link>
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
            <li
              key={link.href}
              className={
                activeLink === link.href ? "bg-gray-200 rounded-md" : ""
              }
            >
              <Link
                href={link.href}
                className={
                  activeLink === link.href ? "text-blue-600 font-semibold" : ""
                }
                onClick={() => setActiveLink(link.href)}
              >
                {link.label}
              </Link>
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
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 transition-transform transform-gpu"
          >
            <li>
              <p
                onClick={() => logout(null)}
                className="cursor-pointer text-red-600 hover:text-red-800 transition-colors duration-200"
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

export default dynamic(() => Promise.resolve(MyNavBar), { ssr: false });
