"use client";

import React, { useState } from "react";
import { useStoreState, useStoreActions } from "@/app/hooks/hooks";
import { RequirementCategory } from "@/app/store/models/admin/requirements/requirementModel";
import { formatDate } from "@/app/Utils/Utils";
import Image from "next/image";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import Loading from "../../Loading";
import { storage } from "@/app/firebase/config";

const RequirementCategories: React.FC = () => {
  const { requirementCategories, loading } = useStoreState(
    (state) => state.requirements
  );
  const {
    addRequirementCategory,
    updateRequirementCategory,
    deleteRequirementCategory,
  } = useStoreActions((actions) => actions.requirements);

  const [selectedCategory, setSelectedCategory] =
    useState<RequirementCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAdd = () => {
    setSelectedCategory(null);
    setName("");
    setImage("");
    setFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: RequirementCategory) => {
    setSelectedCategory(category);
    setName(category.name);
    setImage(category.image);
    setFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (category: RequirementCategory) => {
    setSelectedCategory(category);
    setIsConfirmOpen(true);
  };

  const handleImageUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `requirementCategories/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    }
    return image;
  };

  const handleSubmit = async () => {
    setUploading(true);
    const imageUrl = await handleImageUpload();

    if (selectedCategory) {
      await updateRequirementCategory({
        id: selectedCategory.id,
        name,
        image: imageUrl,
      });
    } else {
      await addRequirementCategory({ name, image: imageUrl });
    }
    setIsModalOpen(false);
    setUploading(false);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      deleteRequirementCategory(selectedCategory.id);
    }
    setIsConfirmOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = async () => {
    if (selectedCategory?.image) {
      const storageRef = ref(storage, selectedCategory.image);
      await deleteObject(storageRef);
    }
    setFile(null);
    setImage("");
  };

  return loading || uploading ? (
    <Loading />
  ) : (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Requirement Categories
      </h2>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {requirementCategories.map((category: RequirementCategory) => (
          <div
            key={category.id}
            className="card bg-base-100 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <figure className="relative h-48 w-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 ease-in-out hover:scale-110"
              />
              <div className="absolute top-0 right-0 p-2 flex space-x-2">
                <button
                  className="btn btn-sm btn-outline bg-blue-700 text-white"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                  onClick={() => handleDelete(category)}
                >
                  Delete
                </button>
              </div>
            </figure>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-primary mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600">
                Created At:{" "}
                <span className="font-medium">
                  {formatDate(category.createdAt)}
                </span>
              </p>
              <p className="text-gray-600">
                Updated At:{" "}
                <span className="font-medium">
                  {formatDate(category.updatedAt)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {selectedCategory ? "Edit Category" : "Add Category"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              {image && (
                <div className="relative">
                  <img
                    src={image}
                    alt="Selected"
                    className="w-full h-48 object-cover mb-2 rounded"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    &#x2715;
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="input input-bordered w-full"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-outline mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {selectedCategory ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Delete Category</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCategory?.name}</span>?
            </p>
            <div className="flex justify-end">
              <button
                className="btn btn-outline mr-2"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementCategories;
