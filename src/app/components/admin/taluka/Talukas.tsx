"use client";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { formatDate } from "@/app/Utils/Utils";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";

const Talukas = () => {
  const { talukas, isLoading } = useStoreState((state) => state.taluka);
  const { deleteTaluka } = useStoreActions((actions) => actions.taluka);
  const [error, setError] = useState<string | null>(null);
  const usePath = usePathname();
  const router = useRouter();

  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    router.push(`${usePath}/taluka/update/${id}`);
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    console.log(`Delete taluka with id: ${id}`);
    try {
      await deleteTaluka(id);
    } catch (error) {
      console.log("Failed to delete taluka: ", error);
      setError("Failed to delete taluka");
    }
  };

  function handleView(id: string) {
    router.push(`${usePath}/taluka/${id}`);
  }

  return (
    <>
      {!isLoading && (
        <button
          onClick={() => router.push(`${usePath}/taluka/create`)}
          className="btn btn-primary ml-5"
        >
          Add Taluka
        </button>
      )}
      {error ? (
        <div className="p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : !isLoading && talukas.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <table className="table table-zebra w-full text-center">
            <thead className="text-white">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {talukas.map((taluka) => (
                <tr key={taluka.id} onClick={() => handleView(taluka.id)}>
                  <td>
                    <Image
                      src={taluka.talukaIconImage}
                      alt={taluka.talukaName}
                      className="w-16 h-16 object-fill rounded"
                      height={100}
                      width={100}
                      priority={true}
                    />
                  </td>
                  <td>{taluka.talukaName}</td>
                  <td>
                    <p
                      className={`badge ${
                        taluka.isActive ? "badge-success" : "badge-error"
                      }`}
                    >
                      {taluka.isActive ? "Active" : "Inactive"}
                    </p>
                  </td>
                  <td>{formatDate(new Date(taluka.talukaCreatedAt))}</td>
                  <td>{formatDate(new Date(taluka.talukaUpdatedAt))}</td>
                  <td>
                    <button
                      onClick={(e) => handleEdit(e, taluka.id)}
                      className="btn btn-primary btn-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, taluka.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : talukas.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg
              className="h-12 w-12 text-gray-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                d="M5 12l5 5 5-5M5 12l5-5 5 5"
              />
            </svg>
            <p className="mt-4 text-gray-600">No Talukas found.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0114.26-4.24A6.001 6.001 0 0112 4a6.001 6.001 0 01-5.74 3.76A8 8 0 014 12z"
              />
            </svg>
            <p className="mt-4 text-gray-600">Loading Talukas...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Talukas), { ssr: false });
