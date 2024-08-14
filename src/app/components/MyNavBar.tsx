"use client";
import Link from "next/link";
import React from "react";
import { useStoreActions, useStoreState } from "../hooks/hooks";
import Image from "next/image";

const MyNavBar = () => {
  const { logout } = useStoreActions((state) => state.auth);
  const { isAdmin, isReporter, isAuthenticated } = useStoreState(
    (state) => state.auth
  );

  return isAuthenticated ? (
    <nav className="navbar bg-base-100 shadow-md">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            {/* Hamburger Icon */}
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
          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {isAdmin ? (
              <>
                <li>
                  <Link href={"/admin/taluka"}>Taluka</Link>
                </li>
                <li>
                  <Link href={"/admin/news"}>News</Link>
                </li>
                <li>
                  <Link href={"/admin/business"}>Business</Link>
                </li>
                <li>
                  <Link href={"/admin/reporter"}>Reporter</Link>
                </li>
                <li>
                  <Link href={"/admin/historical-places"}>
                    Historical Places
                  </Link>
                </li>
                <li>
                  <Link href={"/admin/admin"}>Admins</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={"/reporter/news"}>News</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          {isAdmin ? "Admin" : isReporter ? "Reporter" : ""} Panel
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {isAdmin ? (
            <>
              <li>
                <Link href={"/admin/taluka"}>Taluka</Link>
              </li>
              <li>
                <Link href={"/admin/news"}>News</Link>
              </li>
              <li>
                <Link href={"/admin/business"}>Business</Link>
              </li>
              <li>
                <Link href={"/admin/reporter"}>Reporter</Link>
              </li>
              <li>
                <Link href={"/admin/historical-places"}>Historical Places</Link>
              </li>
              <li>
                <Link href={"/admin/admin"}>Admins</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href={"/reporter/news"}>News</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Navbar End */}
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
