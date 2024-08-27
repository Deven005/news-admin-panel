"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatDate } from "@/app/Utils/Utils";
import { useStoreState, useStoreActions } from "@/app/hooks/hooks";
import { motion } from "framer-motion";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebase/config";
import { StatusCategory } from "@/app/store/models/admin/status/statusModel";
import Loading from "../../Loading";

const StatusCategories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<StatusCategory | null>(null);
  const [formValues, setFormValues] = useState({
    statusCatName: "",
    statusCatImg: { downloadUrl: "", filePath: "" },
    isActive: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { statusCategories, loading } = useStoreState((state) => state.status);

  const {
    addStatusCategory,
    updateStatusCategory,
    deleteStatusCategory,
    setLoading,
  } = useStoreActions((actions) => actions.status);

  useEffect(() => {
    if (selectedCategory) {
      setFormValues({
        statusCatName: selectedCategory.statusCatName,
        statusCatImg: selectedCategory.statusCatImg,
        isActive: selectedCategory.isActive,
      });
      setImagePreview(selectedCategory.statusCatImg.downloadUrl);
    } else {
      setFormValues({
        statusCatName: "",
        statusCatImg: { downloadUrl: "", filePath: "" },
        isActive: true,
      });
      setImagePreview(null);
    }
  }, [selectedCategory]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToFirebase = async (
    file: File
  ): Promise<{ downloadUrl: string; filePath: string }> => {
    const filePath = `status-categories/${file.name}`;
    const imageRef = ref(storage, filePath);
    await uploadBytes(imageRef, file);
    const downloadUrl = await getDownloadURL(imageRef);
    return { downloadUrl, filePath };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageData = formValues.statusCatImg;

    if (imageFile) {
      imageData = await uploadImageToFirebase(imageFile);
    }

    if (selectedCategory) {
      await updateStatusCategory({
        statusCatId: selectedCategory.statusCatId,
        ...formValues,
        statusCatImg: imageData,
      });
    } else {
      if (imageFile == null) {
        alert("Select image!");
        return;
      }
      await addStatusCategory({
        ...formValues,
        statusCatImg: imageData,
      });
    }

    setFormValues({
      statusCatName: "",
      statusCatImg: { downloadUrl: "", filePath: "" },
      isActive: true,
    });
    setImagePreview(null);
    setImageFile(null);
    setSelectedCategory(null);
    setShowModal(false);
    setLoading(false);
  };

  const handleDelete = async (statusCatId: string) => {
    setLoading(true);
    await deleteStatusCategory(statusCatId);
    setLoading(false);
  };

  const handleEditClick = (category: StatusCategory) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleAddNewClick = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setSelectedCategory(null);
    setShowModal(false);
    setImagePreview(null);
    setImageFile(null);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Status Categories</h2>
        <button onClick={handleAddNewClick} className="btn btn-primary">
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusCategories.map((category: StatusCategory) => (
          <motion.div
            key={category.statusCatId}
            className="card bg-base-100 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-l-4 border-gray-400"
            layout
          >
            <>
              <figure className="relative h-32 w-full">
                <Image
                  src={category.statusCatImg.downloadUrl}
                  alt={category.statusCatName}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="text-xl font-semibold">
                  {category.statusCatName}
                </h3>
                <p className="text-gray-500 text-sm">
                  Created At: {formatDate(category.statusCatCreatedAt)}
                </p>
                <p className="text-gray-500 text-sm">
                  Updated At: {formatDate(category.statusCatUpdatedAt)}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.statusCatId)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          </motion.div>
        ))}
      </div>

      {/* Full-screen Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-3xl max-h-full overflow-auto">
            <h3 className="text-lg font-bold mb-4">
              {selectedCategory ? "Edit Status Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {imagePreview && (
                <figure className="relative h-48 w-full mb-4">
                  <Image
                    src={imagePreview}
                    alt="Category Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </figure>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
              <div className="flex flex-col">
                <label className="text-gray-700">Category Name:</label>
                <input
                  type="text"
                  name="statusCatName"
                  value={formValues.statusCatName}
                  onChange={handleFormChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formValues.isActive}
                  onChange={handleFormChange}
                  className="form-checkbox"
                />
                <label className="ml-2 text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="submit" className="btn btn-primary btn-sm">
                  {selectedCategory ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCategories;
