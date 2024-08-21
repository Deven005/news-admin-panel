"use client";
import Admins from "@/app/components/admin/Admins";
import Reporters from "@/app/components/admin/reporter/Reporters";
import UserList from "@/app/components/admin/user/Users";
import React, { useState } from "react";

type UserRole = "Users" | "Reporters" | "Admins";

const Users = () => {
  const usersTypeList: UserRole[] = ["Users", "Reporters", "Admins"];
  const [selectedRole, setSelectedRole] = useState<UserRole>("Reporters");

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
    <div>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Select User Type</span>
        </div>
        <select
          className="select select-bordered"
          onChange={(e) => handleRoleSelection(e.target.value as UserRole)}
        >
          {usersTypeList.map((userType: UserRole, index) => {
            return (
              <option
                selected={selectedRole == userType ? true : false}
                key={index}
              >
                {userType}
              </option>
            );
          })}
        </select>
        <div className="label">
          {/* <span className="label-text-alt">Alt label</span> */}
          {/* <span className="label-text-alt">Alt label</span> */}
        </div>
      </label>
      {selectedRole == "Reporters" ? (
        <Reporters />
      ) : selectedRole == "Admins" ? (
        <Admins />
      ) : (
        <UserList />
      )}
    </div>
  );
};

export default Users;
