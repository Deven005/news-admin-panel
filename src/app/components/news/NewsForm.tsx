"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { doApiCall } from "@/app/Utils/Utils";
import TalukaDropdown from "../admin/taluka/TalukaDropdown";
import { NewsType } from "@/app/store/models/news/NewsModel";

interface NewsFormProps {
  mode: string;
  initialData?: NewsType;
}

const NewsForm = ({ mode, initialData }: NewsFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [news, setNews] = useState<NewsType>({
    id: "",
    title: "",
    description: "",
    image: "",
    imagePath: "",
    talukaID: initialData?.talukaID ?? "",
    isActive: false,
    likes: 0,
    dislikes: 0,
    views: 0,
    shares: 0,
    timestampCreatedAt: new Date(),
    timestampUpdatedAt: new Date(),
    likedByUsers: [],
    disLikedByUsers: [],
    ...initialData,
  });
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsType>({
    defaultValues: {
      id: "",
      title: "",
      description: "",
      image: "",
      imagePath: "",
      talukaID: initialData?.talukaID ?? "",
      isActive: false,
      likes: 0,
      dislikes: 0,
      views: 0,
      shares: 0,
      timestampCreatedAt: new Date(),
      timestampUpdatedAt: new Date(),
      likedByUsers: [],
      disLikedByUsers: [],
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        // Set values for each field
        setValue(key as keyof NewsType, initialData[key as keyof NewsType]);
      });
      setNews(initialData);
    }
  }, [initialData, setValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setValue("image", URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (updatedNews: NewsType) => {
    console.log("mode", mode);

    console.log("onSubmit updatedNews: ", updatedNews);

    const formData = new FormData();
    var callType = "",
      url = "/reporter/news";

    try {
      switch (mode) {
        case "add":
          if (imageFile == null) {
            alert("Select image!");
            return;
          }
          console.log("case add");

          formData.append("title", updatedNews.title);
          formData.append("description", updatedNews.description);
          formData.append("talukaID", updatedNews.talukaID);
          formData.append("image", imageFile);
          break;
        case "update":
          callType = "p";
          url = `${"/reporter/news"}/${news.id}`;
          if (news.title != updatedNews.title)
            formData.append("title", updatedNews.title);
          if (news.description != updatedNews.description)
            formData.append("description", updatedNews.description);
          if (news.talukaID != updatedNews.talukaID)
            formData.append("talukaID", updatedNews.talukaID);
          if (news.isActive != updatedNews.isActive)
            formData.append("isActive", String(updatedNews.isActive));
          if (imageFile) formData.append("image", imageFile);
          break;

        default:
          break;
      }

      const response: Response = await doApiCall({
        url: url,
        formData: formData,
        callType: callType,
      });
      console.log("add news res: ", response);
      //   setIsLoading(false);
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      router.back();
    } catch (error) {
      //   setIsLoading(false);
      console.error("Error adding category:", error);
      alert("Failed to add category");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          {mode === "add" && "Add News"}
          {mode === "update" && initialData ? "Update News" : ""}
          {mode === "view" && "News Details"}
        </h2>
        {mode !== "view" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card shadow-lg p-6 rounded-lg bg-gray-100">
              <h3 className="text-xl font-semibold mb-4">News Details</h3>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={mode === "view"}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs italic">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={4}
                  disabled={mode === "view"}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs italic">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded"
                  disabled={mode === "view"}
                />
                {selectedImage && mode !== "view" && (
                  <div className="mt-4">
                    <img
                      src={selectedImage as string}
                      alt="Selected"
                      className="w-full h-64 object-cover rounded"
                    />
                  </div>
                )}
                {mode === "view" && initialData?.image && (
                  <div className="mt-4">
                    <Image
                      src={initialData.image}
                      alt={initialData.title}
                      width={500}
                      height={300}
                      className="w-full h-64 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <TalukaDropdown
                  mode={mode}
                  {...register("talukaID", { required: "Taluka is required" })}
                  errors={errors}
                  register={register}
                />
                {errors.talukaID && (
                  <p className="text-red-500 text-xs italic">
                    {errors.talukaID.message}
                  </p>
                )}
              </div>

              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={mode === "view"}
                />
                <label className="block text-gray-700 font-semibold">
                  Active
                </label>
              </div>

              {mode !== "view" && (
                <div className="flex justify-center space-x-4">
                  <button type="submit" className="btn btn-primary w-1/2">
                    {mode === "add" ? "Add News" : "Update News"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn btn-secondary w-1/2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        )}

        {mode === "view" && initialData && (
          <div className="card shadow-lg p-6 rounded-lg bg-gray-100">
            <div className="mb-6">
              <Image
                src={initialData.image}
                alt={initialData.title}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded"
              />
            </div>
            <div className="mb-4">
              <p className="font-bold text-lg">Title:</p>
              <p>{initialData.title}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold text-lg">Description:</p>
              <p>{initialData.description}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold text-lg">Likes:</p>
              <p>{initialData.likes}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold text-lg">Dislikes:</p>
              <p>{initialData.dislikes}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold text-lg">Views:</p>
              <p>{initialData.views}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold text-lg">Shares:</p>
              <p>{initialData.shares}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold text-lg">Status:</p>
              <p
                className={`font-semibold ${
                  initialData.isActive ? "text-green-500" : "text-red-500"
                }`}
              >
                {initialData.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="btn btn-primary"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsForm;
