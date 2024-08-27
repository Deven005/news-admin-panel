"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { formatDate } from "@/app/Utils/Utils";
import StatusModal from "./StatusModal";
import { Status } from "@/app/store/models/admin/status/statusModel";
import Loading from "../../Loading";
import AddStatusModal from "./AddStatusModal";

const Statuses: React.FC = () => {
  const { statuses, loading } = useStoreState((state) => state.status);
  const { admins } = useStoreState((state) => state.admin);
  const { reporters } = useStoreState((state) => state.reporter);
  const { updateStatusActive } = useStoreActions((actions) => actions.status);

  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState(false);
  const [statusPostedBy, setStatusPostedBy] = useState<string>("");

  const handleCardClick = (status: Status, statusPostedBy: string) => {
    setSelectedStatus(status);
    setStatusPostedBy(statusPostedBy);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedStatus(null);
  };

  const handleToggleActive = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    statusID: string,
    isActive: boolean
  ) => {
    e.stopPropagation(); // Prevent card click event
    await updateStatusActive({ statusID, isActive: !isActive });
  };

  const handleAddStatusClick = () => {
    setIsAddStatusModalOpen(true);
  };

  const handleCloseAddStatusModal = () => {
    setIsAddStatusModalOpen(false);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Statuses</h2>
        <button onClick={handleAddStatusClick} className="btn btn-primary">
          Add Status
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {statuses.map((status) => {
          const currentAdmin = admins.find(
            (admin) => admin.id === status.statusPostedBy
          );
          const currentReporter = reporters.find(
            (reporter) => reporter.reporterID === status.statusPostedBy
          );
          const statusPostedBy = currentAdmin
            ? `${currentAdmin?.userFirstName} ${currentAdmin?.userLastName}`
            : `${currentReporter?.reporterFirstName} ${currentReporter?.reporterLastName}`;
          return (
            <div
              key={status.statusID}
              className={`card bg-base-100 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200 rounded-lg overflow-hidden cursor-pointer ${
                status.isActive ? "border-green-500" : "border-red-500"
              }`}
              onClick={() => handleCardClick(status, statusPostedBy)}
            >
              <figure className="relative h-48 w-full">
                <Image
                  src={status.statusImgs[0]?.downloadUrl || ""}
                  alt="Status Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </figure>
              <div className="p-4">
                <p className="text-sm text-gray-600">
                  Status Count: {status.statusImgs.length}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  Posted by: {statusPostedBy}
                </p>
                <p className="text-xs text-gray-400">
                  Created at: {formatDate(status.statusCreatedAt)}
                </p>
                <button
                  onClick={(e) =>
                    handleToggleActive(e, status.statusID, status.isActive)
                  }
                  className={`mt-2 px-4 py-2 text-white rounded ${
                    status.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {status.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        status={selectedStatus!}
        statusPostedBy={statusPostedBy}
      />
      <AddStatusModal
        isOpen={isAddStatusModalOpen}
        onClose={handleCloseAddStatusModal}
      />
    </div>
  );
};

export default Statuses;
