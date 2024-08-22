"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import Loading from "../../Loading";
import { convertTimestampToDate } from "@/app/Utils/Utils";
import { usePathname, useRouter } from "next/navigation";

const UserList = () => {
  const { users, loading } = useStoreState((state) => state.user);
  const fetchUsers = useStoreActions((actions) => actions.user.fetchUsers);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, [fetchUsers]);

  return loading && users.length == 0 ? (
    <Loading />
  ) : users.length === 0 ? (
    <div className="flex justify-center items-center text-center min-h-80">
      <div className="text-xl font-semibold">No users found.</div>
    </div>
  ) : (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue">
            <tr>
              <th className="p-2">Profile Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Phone Number</th>
              <th className="p-2">Creation Time</th>
              <th className="p-2">Last Sign-In Time</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t"
                onClick={() => router.push(`${pathname}/${user.id}`)}
              >
                <td className="p-2">
                  <Image
                    src={user.profileImage}
                    alt={user.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.phoneNumber}</td>
                <td>{convertTimestampToDate(user.creationTime)}</td>
                <td>{convertTimestampToDate(user.lastSignInTime)}</td>
                {/* <td className="p-2">
                  {new Date(user.creationTime).toLocaleString("en-US", {
                    timeZoneName: "short",
                  })}
                </td>
                <td className="p-2">
                  {user.lastSignInTime &&
                    new Date(user.lastSignInTime).toLocaleString("en-US", {
                      timeZoneName: "short",
                    })}
                </td> */}
                <td className="p-2">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
