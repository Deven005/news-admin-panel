"use client";
import InputField from "@/app/components/InputField";
import InputTextAreaField from "@/app/components/InputTextAreaField";
import { HistoricalPlace } from "@/app/store/models/historical-places/historicalPlacesModel";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Loading from "../../Loading";
import GoogleMapComponent from "../../google-map/GoogleMapComponent";
import Image from "next/image";

const validateSchema = Yup.object({
  placeName: Yup.string().required("This field is required").min(5),
  placeDescription: Yup.string().required("This field is required").min(5),
}).required();

type PropsType = {
  isEdit?: boolean;
  place?: HistoricalPlace | undefined;
};

type PlaceFormData = {
  placeName: string;
  placeDescription: string;
  placeLatitude: string;
  placeLongitude: string;
};

const HistoricalPlacesAddEdit = ({ isEdit = false, place }: PropsType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [latitude, setLatitude] = useState<number>(
    place?.placeLatitude || 37.7749
  );
  const [longitude, setLongitude] = useState<number>(
    place?.placeLongitude || -122.4194
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (isEdit && place) {
      setValue("placeName", place.placeName);
      setValue("placeDescription", place.placeDescription);
      setLatitude(place.placeLatitude);
      setLongitude(place.placeLongitude);
    }
  }, [isEdit, place, setValue]);

  const handleCreateUpdatePlace = async (event: PlaceFormData) => {
    try {
      setIsLoading(true);
      const { placeName, placeDescription } = event;

      const formData = new FormData();
      formData.append("placeName", placeName);
      formData.append("placeDescription", placeDescription);
      formData.append("placeLatitude", latitude.toString());
      formData.append("placeLongitude", longitude.toString());

      selectedImages.forEach((image) => formData.append("files", image));
      selectedVideos.forEach((video) => formData.append("files", video));

      const res = await doApiCall({
        url: `/admin/historical-places/${place?.placeID ?? ""}`,
        callType: isEdit ? "p" : "",
        formData: formData,
      });

      if (res.ok) {
        showToast(`Historical place is ${isEdit ? "Updated" : "Added"}`, "s");
        router.back();
      } else {
        console.error("Something went wrong: ", res);
        showToast(
          `Something is wrong while ${
            isEdit ? "Updating" : "Adding"
          } Historical place`,
          "e"
        );
      }
    } catch (error) {
      console.error("Error creating or updating place:", error);
      showToast(`Historical place is not ${isEdit ? "Updated" : "Added"}`, "e");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedVideos(Array.from(files));
    }
  };

  const handlePlaceImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    const files = event.target.files;
    if (files) {
      setSelectedImages(Array.from(files));
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(previews);
    }
  };

  const handleDeleteFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
    type: "image" | "video"
  ) => {
    e.stopPropagation();

    if (type === "image") {
      const updatedImages = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updatedImages);
      setImagePreviews(
        updatedImages.map((image) => URL.createObjectURL(image))
      );
    } else if (type === "video") {
      const updatedVideos = selectedVideos.filter((_, i) => i !== index);
      setSelectedVideos(updatedVideos);
    }

    // Reset file input state if no files remain
    if (selectedImages.length === 1 && type === "image") {
      setSelectedImages([]);
      setImagePreviews([]);
    } else if (selectedVideos.length === 1 && type === "video") {
      setSelectedVideos([]);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="card w-full max-w-4xl bg-white shadow-lg rounded-lg">
            <div className="card-body">
              <h2 className="text-2xl font-semibold mb-4">
                {isEdit ? "Update" : "Add"} Historical Place
              </h2>
              <form
                onSubmit={handleSubmit((e) =>
                  handleCreateUpdatePlace({
                    placeName: e.placeName,
                    placeDescription: e.placeDescription,
                    placeLatitude: "",
                    placeLongitude: "",
                  })
                )}
                className="space-y-4"
              >
                <InputField
                  {...register("placeName")}
                  type="text"
                  label="Place Name"
                  placeholder="Enter place name"
                  required={true}
                />
                {errors.placeName && (
                  <p className="text-red-500 text-sm">
                    {errors.placeName.message}
                  </p>
                )}

                <InputTextAreaField
                  name="placeDescription"
                  register={register("placeDescription")}
                  type="text"
                  label="Place Description"
                  placeholder="Enter place description"
                  rows={4}
                  required={true}
                />
                {errors.placeDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.placeDescription.message}
                  </p>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Place Images Gallery</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePlaceImagesChange}
                    className="file-input"
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <p className="text-2xl font-bold mb-4 text-gray-900">
                      Place Images Gallery Preview:
                    </p>
                    <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {imagePreviews.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-32 h-32 overflow-hidden rounded-lg shadow-md border border-gray-200"
                        >
                          <Image
                            src={img}
                            alt={`preview-${index}`}
                            className="w-20 h-20 object-contain rounded text-center"
                            height={100}
                            width={100}
                          />

                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                            onClick={(e) => handleDeleteFile(e, index, "image")}
                            aria-label="Delete image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Place Videos</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="file-input"
                  />
                </div>

                {selectedVideos.length > 0 && (
                  <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
                    <p className="text-2xl font-bold mb-4 text-gray-900">
                      Video Previews:
                    </p>
                    <div className="grid grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                      {selectedVideos.map((video, index) => (
                        <div
                          key={index}
                          className="relative flex items-center justify-center w-full h-40"
                        >
                          <video
                            controls
                            className="w-full h-full object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
                          >
                            <source
                              src={URL.createObjectURL(video)}
                              type={video.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                            onClick={(e) => handleDeleteFile(e, index, "video")}
                            aria-label="Delete video"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
                  <p className="text-2xl font-bold mb-4 text-gray-900">
                    Select Location on Map:
                  </p>
                  <GoogleMapComponent
                    draggable={isEdit || place == null ? true : false}
                    onLocationSelect={({ lat, lng }) => {
                      setLatitude(lat);
                      setLongitude(lng);
                    }}
                    initialLatitude={place?.placeLatitude ?? latitude}
                    initialLongitude={place?.placeLongitude ?? longitude}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors"
                  >
                    {isEdit ? "Update" : "Add"} Historical Place
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoricalPlacesAddEdit;
