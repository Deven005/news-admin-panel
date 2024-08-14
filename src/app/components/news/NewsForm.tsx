"use client";
import { useState, useEffect, useRef } from "react";
import Loading from "@/app/components/Loading";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { useRouter } from "next/navigation";
import React from "react";
import { NewsType } from "@/app/store/models/news/NewsModel";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import Image from "next/image";

interface NewsFormProps {
  news?: NewsType;
}

const NewsForm = ({ news }: NewsFormProps) => {
  const [title, setTitle] = useState(news?.title || "");
  const [description, setDescription] = useState(news?.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    news?.image || ""
  );
  const { loading } = useStoreState((state) => state.news);
  const talukas = useStoreState((state) => state.taluka.talukas);
  const [selectedTaluka, setSelectedTaluka] = useState<string>(talukas[0]?.id);
  const { setLoading } = useStoreActions((state) => state.news);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const isEditing = !!news;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(news?.image || ""); // Reset to the initial image URL
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("talukaID", selectedTaluka);
    if (image) {
      formData.append("image", image);
    }

    try {
      const url = isEditing ? `/reporter/news/${news?.id}` : "/reporter/news";
      const callType = isEditing ? "p" : "";

      const response = await doApiCall({
        url,
        formData,
        callType,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} news`);
      }
      showToast(`${isEditing ? "Updated" : "Added"} news`, "s");
      router.back();
    } catch (error) {
      // console.error(`${isEditing ? "Update" : "Add"} news error:`, error);
      showToast(`Failed to ${isEditing ? "update" : "add"} news`, "e");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">
        {news == undefined ? "Add" : "Update"} News
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <select
            id="taluka"
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {talukas.map((taluka) => (
              <option key={taluka.id} value={taluka.id}>
                {taluka.talukaName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100"
          />
          {imagePreview && (
            <div className="relative mt-4 w-full h-48">
              {/* <Image
                src={imagePreview}
                alt="Preview"
                className="object-cover w-full h-full rounded-md shadow-md"
              /> */}
              <Image
                src={imagePreview}
                alt={`preview-${0}`}
                className="w-full h-full object-fill rounded-md shadow-md"
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
