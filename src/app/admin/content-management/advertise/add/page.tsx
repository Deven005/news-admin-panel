"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { doApiCall, showToast } from "@/app/Utils/Utils";

const AddAdvertise = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await doApiCall({
        url: "/admin/advertises",
        callType: "",
        formData: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add advertisement");
      }

      showToast("Advertisement added successfully!", "s");
      router.back();
    } catch (error) {
      console.error("Error adding advertisement:", error);
      showToast("Failed to add advertisement.", "e");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Advertisement</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Image */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full h-40">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                layout="fill"
                className="rounded-lg object-contain"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg border border-gray-300">
                <span className="text-gray-500">No Image Selected</span>
              </div>
            )}
            {selectedFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 btn btn-xs btn-circle btn-error transform hover:scale-110 transition-transform"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center space-y-4">
          <label className="block text-lg font-medium text-gray-700 mt-4">
            Select Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file-input file-input-bordered w-full max-w-xs mt-2"
          />

          <button
            type="submit"
            onClick={handleSubmit}
            className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Advertisement"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdvertise;
