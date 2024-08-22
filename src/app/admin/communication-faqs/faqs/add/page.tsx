"use client";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(5).trim(),
  description: yup.string().required("Description is required").min(10).trim(),
});

interface FormValues {
  title: string;
  description: string;
}

const AddFAQComponent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const addFAQ = useStoreActions((actions) => actions.faqs.addFAQ);
  const loading = useStoreState((state) => state.faqs.loading);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      await addFAQ({
        title: data.title,
        description: data.description,
      });
      router.back();
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <motion.div
        className="card bg-white shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-semibold mb-4 text-center">Add New FAQ</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label htmlFor="title" className="label">
              <span className="label-text">Title</span>
            </label>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  id="title"
                  type="text"
                  placeholder="Enter FAQ title"
                  className={`input input-bordered w-full ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="description" className="label">
              <span className="label-text">Description</span>
            </label>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <textarea
                  {...field}
                  id="description"
                  placeholder="Enter FAQ description"
                  className={`textarea textarea-bordered w-full ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  rows={4}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full relative flex items-center justify-center"
            disabled={loading}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2z"
                  ></path>
                </svg>
              </div>
            )}
            {loading ? "Adding..." : "Add FAQ"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddFAQComponent;
