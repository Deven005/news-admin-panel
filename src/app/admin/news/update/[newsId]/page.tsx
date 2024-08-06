"use client";
import Loading from "@/app/components/Loading";
import MyNavBar from "@/app/components/MyNavBar";
import { useStoreState } from "@/app/hooks/hooks";
import { doApiCall } from "@/app/Utils/Utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const UpdateNews = () => {
  const newsId = usePathname().split("/").pop();
  const news = useStoreState((state) => state.news.news);
  const newsItem = news.find((p) => p.id === newsId)!;
  const [title, setTitle] = useState(newsItem.title);
  const [description, setDescription] = useState(newsItem.description);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    newsItem?.image ?? ""
  );
  const router = useRouter();

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (image == null) {
      alert("Select image!");
      return;
    }
    const formData = new FormData();
    if (newsItem.title != title) formData.append("title", title);
    if (newsItem.description != description)
      formData.append("description", description);
    // if (newsItem.talukaID != talukaID) formData.append("talukaID", talukaID);
    // if (newsItem.isActive != isActive)
    // formData.append("isActive", String(isActive));
    if (image) formData.append("image", image);

    const response: Response = await doApiCall({
      url: `/reporter/news/${newsItem.id}`,
      formData: formData,
      callType: "p",
    });
    console.log("add news res: ", response);
    //   setIsLoading(false);
    if (!response.ok) {
      throw new Error("Failed to add category");
    }
    router.back();
  };

  return (
    <>
      <MyNavBar />
      {news == null ? (
        <Loading />
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Update News</h1>
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
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover"
                />
              )}
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateNews;
