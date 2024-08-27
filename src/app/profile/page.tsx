"use client";
import React from "react";
import { convertTimestampToDate, formatDate } from "../Utils/Utils";
import { useStoreState } from "../hooks/hooks";
import Loading from "../components/Loading";

const Profile = () => {
  const { isAdmin, isReporter, isLoading, user, isAuthenticated } =
    useStoreState((states) => states.auth);
  const { admins } = useStoreState((states) => states.admin);
  const currentAdmin = admins.find((admin) => admin.userUid == user?.uid);

  const { reporters } = useStoreState((states) => states.reporter);
  const currentReporter = reporters.find(
    (reporter) => reporter.reporterID == user?.uid
  );

  return !isAuthenticated ||
    isLoading ||
    user === undefined ||
    currentReporter === undefined ||
    currentAdmin === undefined ? (
    <Loading />
  ) : (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-10 pt-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          {isReporter ? "Reporter" : isAdmin ? "Admin" : ""} Profile
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">Name:</span>
            <span className="text-gray-800">{user.displayName}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">
              Email Verified:
            </span>
            <span className="text-gray-800">
              {user.emailVerified ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">Created At:</span>
            <span className="text-gray-800">
              {formatDate(user.metadata?.creationTime)}
            </span>
          </div>
          {currentReporter !== undefined && (
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-40">
                Last Updated Time:
              </span>
              <span className="text-gray-800">
                {formatDate(currentReporter?.reporterUpdatedAt)}
              </span>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">
              Last SignIn Time:
            </span>
            <span className="text-gray-800">
              {formatDate(user.metadata?.lastSignInTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
