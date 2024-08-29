"use client";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { Taluka } from "@/app/store/models/taluka/talukaModel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import React from "react";

interface TalukaFormProps {
  taluka?: Taluka;
}

const TalukaForm = ({ taluka }: TalukaFormProps) => {
  const [talukaName, setTalukaName] = useState(taluka?.talukaName || "");
  const [isActive, setIsActive] = useState(taluka?.isActive ?? true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    taluka?.talukaIconImage || null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addOrUpdateTaluka, setLoading } = useStoreActions(
    (actions) => actions.taluka
  );
  const isLoading = useStoreState((states) => states.taluka.isLoading);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(taluka?.talukaIconImage || null); // Reset to original image if available
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addOrUpdateTaluka({
        id: taluka?.id,
        talukaName: talukaName,
        isActive,
        image,
      });
      setTalukaName("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setLoading(false);
      router.back();
    } catch (error) {
      setLoading(false);
      console.error("Error adding/updating taluka: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
              />
            </svg>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {taluka ? "Update Taluka" : "Add Taluka"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label htmlFor="talukaName" className="label">
                  <span className="label-text text-lg font-medium">
                    Taluka Name
                  </span>
                </label>
                <input
                  id="talukaName"
                  type="text"
                  value={talukaName}
                  onChange={(e) => setTalukaName(e.target.value)}
                  placeholder="Enter Taluka Name"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex items-center space-x-3">
                <label htmlFor="isActive" className="label text-lg font-medium">
                  Active
                </label>
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  className="toggle toggle-accent"
                />
              </div>

              <div className="form-control">
                <label htmlFor="image" className="label">
                  <span className="label-text text-lg font-medium">
                    Upload Image
                  </span>
                </label>
                <input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="file-input file-input-bordered w-full"
                />
                {(imagePreview || taluka?.talukaIconImage) && (
                  <div className="relative mt-4 w-full h-64 overflow-hidden rounded-lg shadow-md border border-gray-300">
                    <Image
                      src={imagePreview || (taluka?.talukaIconImage ?? "")}
                      alt="Preview"
                      className="object-fill w-full h-full rounded"
                      height={100}
                      width={100}
                      priority={true}
                    />

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white text-gray-800 rounded-full p-1 shadow-lg border border-gray-300 hover:bg-gray-100 transition duration-200"
                    >
                      <span className="sr-only">Remove image</span>
                      <svg
                        className="w-6 h-6"
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
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                {taluka ? "Update Taluka" : "Add Taluka"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TalukaForm;
