"use client";
import InputField from "@/app/components/InputField";
import InputTextAreaField from "@/app/components/InputTextAreaField";
import MyNavBar from "@/app/components/MyNavBar";
import { HistoricalPlace } from "@/app/store/models/historical-places/historicalPlacesModel";
import { doApiCall } from "@/app/Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Loading from "../../Loading";

type PropsType = {
  isEdit?: boolean;
  place?: HistoricalPlace | undefined;
};

type PlaceFormData = {
  placeName: string;
  placeDescription: string;
};

const validateSchema = Yup.object()
  .shape({
    placeName: Yup.string().required("This field is required").min(5),
    placeDescription: Yup.string().required("This field is required").min(5),
  })
  .required();

const HistoricalPlacesAddEdit = ({ isEdit = false, place }: PropsType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });
  const router = useRouter();
  const handleCreateUpdatePlace = async (event: PlaceFormData) => {
    try {
      setIsLoading(true);
      const { placeName, placeDescription } = event;

      const formData = new FormData();
      formData.append("placeName", placeName);
      formData.append("placeDescription", placeDescription);
      selectedImages.forEach((image) => {
        formData.append("files", image);
      });
      selectedVideos.forEach((video) => {
        formData.append("files", video);
      });

      const res = await doApiCall({
        url: "/admin/historical-places",
        callType: "",
        formData: formData,
      });
      console.log("res: ", res);
      if (res.ok) {
        setIsLoading(false);
        router.back();
      } else {
        console.log("Something is wrong add new place: try block");
      }
    } catch (error) {
      console.log("create place err: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      setValue("placeName", place?.placeName ?? "");
      setValue("placeDescription", place?.placeDescription ?? "");
    }
  }, []);

  const handlePlaceImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    setSelectedImages([]);
    setImagePreviews([]);
    if (files) {
      const newImages: File[] = Array.from(files);
      setSelectedImages([...selectedImages, ...newImages]);

      // Generate image previews
      const newPreviews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            newPreviews.push(e.target.result as string);
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
        return;
      });
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedVideos([]);
    if (files) {
      const newVideos: File[] = Array.from(files);
      setSelectedVideos([...selectedVideos, ...newVideos]);
      return;
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <MyNavBar />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="card h-5/6 w-5/6 bg-base-100 shadow-2xl shadow-blue-700 justify-center items-center text-center">
          <div
            className="card-body max-h-80 overflow-y-auto"
            style={{ width: "inherit" }}
          >
            <h2 className="card-title">
              {isEdit == false ? "Add" : "Update"} Historical place
            </h2>
            <p>{errors.root?.message}</p>
            <form onSubmit={handleSubmit(handleCreateUpdatePlace)}>
              <InputField
                register={register("placeName")}
                type={"text"}
                label={"Place name"}
                placeholder={"Enter place name"}
              />
              <p>{errors.placeName?.message}</p>
              <InputTextAreaField
                register={register("placeDescription")}
                type={"text"}
                label={"Place Description"}
                placeholder={"Enter place description"}
              />
              <p>{errors.placeDescription?.message}</p>
              <label className="form-control w-full max-w-xl">
                <div className="label">
                  <span className="label-text">Place images gallery</span>
                </div>
                <input
                  type="file"
                  placeholder="Select place images gallery"
                  required={true}
                  onChange={handlePlaceImagesChange}
                  multiple
                  accept="image/*"
                />
              </label>

              {imagePreviews.length > 0 && (
                <>
                  <p className="text-start pt-3">
                    Place images gallery Preview
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {imagePreviews.map((img, index) => {
                      return (
                        <div key={index} className="avatar pt-5">
                          <div className="w-14 rounded-xl">
                            <img src={img} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              <InputField
                type="file"
                label="Please select videos"
                placeholder="Select videos"
                onChange={handleVideoChange}
                accept="video/*"
              />
              <div className="mt-4">
                <p>Video Previews:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVideos.map((video, index) => (
                    <div key={index} className="relative">
                      <video controls className="max-w-xs max-h-40">
                        <source
                          src={URL.createObjectURL(video)}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" type="submit">
                  {!isEdit ? "Add" : "Update"} Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalPlacesAddEdit;
