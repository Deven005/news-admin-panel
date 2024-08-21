"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { AdvertiseType } from "@/app/components/admin/advertises/Advertises";
import Image from "next/image";
import { doApiCall, showToast } from "@/app/Utils/Utils";

const AdvertiseDetails = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [advertise, setAdvertise] = useState<AdvertiseType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const unsubscribe = onSnapshot(
        doc(firestore, "advertises", id),
        (doc) => {
          const data = doc.data() as AdvertiseType;
          setAdvertise({ ...data, advertiseId: doc.id });
          setImagePreview(data.advertiseImg.downloadUrl);
        }
      );
      return () => unsubscribe();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(advertise?.advertiseImg.downloadUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertise) return;

    setIsLoading(true);

    try {
      //   await updateDoc(doc(firestore, "advertises", id!), {
      //     advertiseImg: {
      //       ...advertise.advertiseImg,
      //       downloadUrl: imagePreview || advertise.advertiseImg.downloadUrl,
      //     },
      //     advertiseUpdatedAt: Timestamp.now(),
      //   });

      if (!selectedFile) {
        return;
      }
      const updateAdForm = new FormData();
      updateAdForm.append("file", selectedFile);

      const response = await doApiCall({
        url: `/admin/advertises/${advertise.advertiseId}`,
        callType: "p",
        formData: updateAdForm,
      });

      if (!response.ok) {
        throw Error(await response.json());
      }

      showToast("Advertisement updated successfully!", "s");
      router.back();
    } catch (error) {
      console.error("Error updating advertisement:", error);
      showToast("Failed to update advertisement.", "e");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Edit Advertisement
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Image */}
        <div className="flex flex-col items-center justify-center">
          {imagePreview && (
            <div className="relative w-full">
              <Image
                src={imagePreview}
                alt="Advertise Image"
                width={800}
                height={200}
                className="rounded-lg border border-gray-300 shadow-sm object-cover w-full h-48"
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
          )}

          <label className="block text-lg font-medium text-gray-700 mt-4">
            Select New Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef} // Attach the ref to the file input
            className="file-input file-input-bordered w-full max-w-xs mt-2"
          />
        </div>

        {/* Right Side - Advertisement Details */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Advertisement ID</span>
            </label>
            <p className="text-gray-700 text-sm">{advertise?.advertiseId}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Created At</span>
            </label>
            <p className="text-gray-700 text-sm">
              {advertise?.advertiseCreatedAt.toDate().toLocaleString("en-US")}
            </p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Updated At</span>
            </label>
            <p className="text-gray-700 text-sm">
              {advertise?.advertiseUpdatedAt.toDate().toLocaleString("en-US")}
            </p>
          </div>

          <button
            type="submit"
            onClick={handleUpdate}
            className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Advertisement"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertiseDetails;
