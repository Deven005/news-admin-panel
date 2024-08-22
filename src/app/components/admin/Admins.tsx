"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import Loading from "@/app/components/Loading";

const Modal = ({ onClose, onConfirm, children }: any) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {children}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
          >
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Admins = () => {
  const router = useRouter();
  const { loading, admins } = useStoreState((states) => states.admin);
  const { user } = useStoreState((states) => states.auth);
  const { getAdmins, deleteAdmin } = useStoreActions((states) => states.admin);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const handleCreateAdminClick = () => {
    router.push("/admin/admin/create");
  };

  const handleEditClick = (adminId: string) => {
    router.push(`/admin/admin/update/${adminId}`);
  };

  const handleDeleteClick = (adminId: string) => {
    setSelectedAdminId(adminId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedAdminId) {
      await deleteAdmin(selectedAdminId);
      setDeleteModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedAdminId(null);
  };

  useEffect(() => {
    getAdmins();
  }, [getAdmins]);

  return loading && admins.length == 0 ? (
    <Loading />
  ) : (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admins List</h1>
        <button
          onClick={handleCreateAdminClick}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Admin
        </button>
      </div>
      {admins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-4">No Admins Available</h2>
          <p className="mb-6">
            It looks like there are no admins in the system. You can add new
            admins using the button below.
          </p>
          <button
            onClick={handleCreateAdminClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Admin
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                {/* <th className="text-left p-4">Avatar</th> */}
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Email Verified</th>
                <th className="p-4">Created At</th>
                {/* <th className="p-4">Last Sign In</th> */}
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="text-center border-b hover:bg-gray-100"
                >
                  {/* <td className="p-4">
                    <Image
                      src={admin.avatarUrl}
                      alt={`${admin.userFirstName} ${admin.userLastName}`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </td> */}
                  <td className="p-4">{`${admin.userFirstName} ${admin.userLastName}`}</td>
                  <td className="p-4">{admin.userEmail}</td>
                  <td className="p-4">
                    {admin.userEmailVerified ? "Yes" : "No"}
                  </td>
                  <td className="p-4">{admin.userCreationTime}</td>
                  {/* <td className="p-4">{admin.userLastSignInTime}</td> */}
                  <td className="p-4 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(admin.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-200"
                    >
                      Edit
                    </button>
                    {user?.uid != admin.userUid && admins.length > 1 && (
                      <button
                        onClick={() => handleDeleteClick(admin.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteModalVisible && (
        <Modal onClose={cancelDelete} onConfirm={confirmDelete}>
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this admin?</p>
        </Modal>
      )}
    </div>
  );
};

export default Admins;
