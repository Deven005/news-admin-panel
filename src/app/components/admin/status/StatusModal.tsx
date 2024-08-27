"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatDate } from "@/app/Utils/Utils";
import { Admin } from "@/app/store/models/admin/adminModel";
import { Reporter } from "@/app/store/models/reporter/reporterModel";
import { Status } from "@/app/store/models/admin/status/statusModel";
import { useStoreState } from "@/app/hooks/hooks";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: Status | null;
  statusPostedBy: string;
}

const StatusModal = ({
  isOpen,
  onClose,
  status,
  statusPostedBy,
}: StatusModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const { statusCategories } = useStoreState((states) => states.status);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen || !status) return null;

  const currentStatusCat = statusCategories.find(
    (cat) => cat.statusCatId == status.statusCatID
  );

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === status.statusImgs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? status.statusImgs.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-4 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 transform transition-transform duration-300 ease-in-out"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 z-20"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Status Details */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-2xl transition-transform transform hover:scale-105 ease-in-out duration-300">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Posted by:{statusPostedBy}
          </h3>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold text-lg">Status ID:</span>{" "}
            {status.statusCatID}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold text-lg">Category Name:</span>{" "}
            {currentStatusCat?.statusCatName}
          </p>
          <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={currentStatusCat?.statusCatImg.downloadUrl!}
              alt="Status Category Image"
              layout="fill"
              objectFit="cover"
              className="transition-transform transform hover:scale-105 ease-in-out duration-300"
            />
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Created at: {formatDate(status.statusCreatedAt)}
          </p>
          <p className="text-sm text-gray-500">
            Updated at: {formatDate(status.statusUpdatedAt)}
          </p>
        </div>

        {/* Image Slider */}
        <div className="relative h-full w-full rounded-lg shadow-2xl overflow-hidden">
          {status.statusImgs.length > 0 && (
            <div className="relative w-full h-full">
              <Image
                src={status.statusImgs[currentImageIndex].downloadUrl}
                alt={`Status Image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="contain"
                className="transition-transform transform hover:scale-105 ease-in-out duration-300"
              />
            </div>
          )}
          {status.statusImgs.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 z-20"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 z-20"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
