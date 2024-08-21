"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import Loading from "@/app/components/Loading";
import Image from "next/image";

const AddSpecialStory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedFile) {
        alert("File is not selected!");
        return;
      }
      setLoading(true);
      const addStoryFormData = new FormData();
      addStoryFormData.append("title", title);
      addStoryFormData.append("description", description);
      addStoryFormData.append("file", selectedFile);

      const response = await doApiCall({
        url: "/admin/special-stories",
        callType: "",
        formData: addStoryFormData,
      });

      if (!response.ok) {
        throw Error(await response.json());
      }
      showToast("Story added!", "s");
      router.back();
    } catch (error) {
      showToast("Story not added!", "e");
      console.error("Failed to add story", error);
    } finally {
      setLoading(false);
    }
  };

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
      fileInputRef.current.value = "";
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full h-80 bg-gray-100 rounded-lg border border-gray-300">
          {imagePreview ? (
            <>
              <Image
                src={imagePreview}
                alt="Selected Image"
                layout="fill"
                className="rounded-lg object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 btn btn-xs btn-circle btn-error transform hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No image selected
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-primary mt-4 w-full"
        >
          {selectedFile ? "Change Image" : "Select Image"}
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-6">Add Special Story</h1>
        <form onSubmit={handleSubmit} className="card shadow-lg p-6 space-y-4">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>

          <div className="form-control">
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpecialStory;
