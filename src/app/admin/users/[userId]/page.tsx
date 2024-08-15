"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStoreState } from "@/app/hooks/hooks";
import { convertTimestampToDate } from "@/app/Utils/Utils";

const UserDetails = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const users = useStoreState((state) => state.user.users);
  const user = users.find((user) => user.id == id);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="flex items-center mb-4">
        <Image
          src={user.profileImage}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p>Phone: {user.phoneNumber}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p>
          <strong>Creation Time:</strong>{" "}
          {convertTimestampToDate(user.creationTime)}
        </p>
        <p>
          <strong>Last Sign-In Time:</strong>{" "}
          {convertTimestampToDate(user.lastSignInTime)}
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
