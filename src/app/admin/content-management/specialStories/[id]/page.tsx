"use client";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { firestore } from "@/app/firebase/config";
import { useState, useEffect, useRef } from "react";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import Loading from "@/app/components/Loading";
import Image from "next/image";

const SpecialStoryDetails = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();
  const [story, setStory] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        doc(firestore, "specialStories", id),
        (doc) => {
          const data = doc.data();
          setStory({ id: doc.id, ...data });
          setImagePreview(data?.image || null); // Set the initial image
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedStory = { ...story };
      const updateStoryFormData = new FormData();

      if (updatedStory["title"])
        updateStoryFormData.append("title", story.title);

      if (updatedStory["description"])
        updateStoryFormData.append("description", story.description);

      if (selectedFile) updateStoryFormData.append("file", selectedFile);

      const response = await doApiCall({
        url: `/admin/special-stories/${id}`,
        callType: "p",
        formData: updateStoryFormData,
      });
      if (!response.ok) {
        throw new Error(await response.json());
      }

      showToast((await response.json())["message"] ?? "Story updated!", "s");
      router.back();
    } catch (error: any) {
      console.error("Failed to update story", error);
      showToast(error["message"] ?? "Story not updated!", "e");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStory({ ...story, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fileInputRef.current?.click();
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(story.image || null); // Show the original image
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  return loading ? (
    <Loading />
  ) : !story ? (
    <div className="flex justify-center items-center h-full">
      <p className="text-xl">Story not found.</p>
    </div>
  ) : (
    <div className="p-6 max-w-6xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6">Edit Special Story</h1>
      <form onSubmit={handleUpdate} className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-shrink-0 w-full md:w-1/3 h-80">
          <div className="relative w-full h-full">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={imagePreview}
                  alt="Story Image"
                  layout="fill"
                  className="rounded-lg object-fill"
                  unoptimized
                />
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
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg border border-gray-300">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={story.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={story.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>

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
            className={`btn btn-primary w-full ${
              loading ? "loading" : ""
            } mt-4 mb-4`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Story"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecialStoryDetails;
