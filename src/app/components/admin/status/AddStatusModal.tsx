"use client";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { AddStatusFormData } from "@/app/store/models/admin/status/statusModel";
import React from "react";
import { useForm } from "react-hook-form";
import Loading from "../../Loading";

interface AddStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStatusModal: React.FC<AddStatusModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStatusFormData>();
  const { statusCategories, loading } = useStoreState(
    (states) => states.status
  );
  const { addStatus } = useStoreActions((actions) => actions.status);

  const onSubmit = async (data: AddStatusFormData) => {
    try {
      await addStatus({ category: data.category, images: data.images });
      onClose();
    } catch (error) {}
  };

  return loading ? (
    <Loading />
  ) : (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold">Add New Status</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Category</span>
            </label>
            <select
              {...register("category", {
                required: "Please select a category",
              })}
              className="select select-bordered w-full"
            >
              <option value="" disabled selected>
                Select a category
              </option>
              {statusCategories.map((category) => (
                <option key={category.statusCatId} value={category.statusCatId}>
                  {category.statusCatName}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500">{errors.category.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Images</span>
            </label>
            <input
              type="file"
              {...register("images", {
                required: "Please upload at least one image",
              })}
              className="file-input file-input-bordered w-full"
              accept="image/*"
              multiple // Allows selecting multiple images
            />
            {errors.images && (
              <span className="text-red-500">{errors.images.message}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStatusModal;
