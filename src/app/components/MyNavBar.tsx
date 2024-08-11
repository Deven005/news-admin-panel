"use client";
import Link from "next/link";
import React from "react";
import { useStoreActions, useStoreState } from "../hooks/hooks";

const MyNavBar = () => {
  const { logout } = useStoreActions((state) => state.auth);
  const { isAdmin, isReporter } = useStoreState((state) => state.auth);
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <Link className="btn btn-ghost text-xl" href="/">
            {isAdmin ? "Admin" : isReporter ? "Reporter" : ""} Panel
          </Link>
        </div>
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
                  <Link href={"/admin/historical-places"}>
                    Historical Places
                  </Link>
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

        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {/* <li>
                <Link className="justify-between" href={""}>
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li> */}
              {/* <li>
                <Link href={""}>Settings</Link>
              </li> */}
              <li>
                <p onClick={() => logout(null)}>Logout</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyNavBar;