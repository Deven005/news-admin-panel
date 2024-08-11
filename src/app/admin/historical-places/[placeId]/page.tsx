"use client";

import GoogleMapComponent from "@/app/components/google-map/GoogleMapComponent";
import HistoricalPlacesAddEdit from "@/app/components/historical-places/create-or-edit/HistoricalPlacesAddEdit";
import Loading from "@/app/components/Loading";
import { useStoreState } from "@/app/hooks/hooks";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PlaceDetailsPage: React.FC = () => {
  const pathname = usePathname();
  const placeID = pathname.split("/").pop();
  const [selectedMedia, setSelectedMedia] = useState<{
    type: string;
    url: string;
  } | null>(null);
  const historicalPlaces = useStoreState(
    (state) => state.historicalPlace.historicalPlaces
  );
  const place = historicalPlaces.find((p) => p.placeID === placeID)!;
  const [isEdit, setIsEdit] = useState(false);
  const [placeDetails, setPlaceDetails] = useState({
    placeLatitude: place?.placeLatitude ?? 0,
    placeLongitude: place?.placeLongitude ?? 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setPlaceDetails({
      ...placeDetails,
      placeLatitude: location.lat,
      placeLongitude: location.lng,
    });
  };

  const closeFullScreenView = () => {
    setSelectedMedia(null);
  };

  const handleNext = () => {
    if (selectedMedia) {
      if (selectedMedia.type === "image") {
        const nextIndex = (currentIndex + 1) % place.images.length;
        setCurrentIndex(nextIndex);
        setSelectedMedia({
          type: "image",
          url: place.images[nextIndex].downloadUrl,
        });
      } else if (selectedMedia.type === "video") {
        const nextIndex = (currentIndex + 1) % place.videos.length;
        setCurrentIndex(nextIndex);
        setSelectedMedia({
          type: "video",
          url: place.videos[nextIndex].downloadUrl,
        });
      }
    }
  };

  const handlePrevious = () => {
    if (selectedMedia) {
      if (selectedMedia.type === "image") {
        const prevIndex =
          (currentIndex - 1 + place.images.length) % place.images.length;
        setCurrentIndex(prevIndex);
        setSelectedMedia({
          type: "image",
          url: place.images[prevIndex].downloadUrl,
        });
      } else if (selectedMedia.type === "video") {
        const prevIndex =
          (currentIndex - 1 + place.videos.length) % place.videos.length;
        setCurrentIndex(prevIndex);
        setSelectedMedia({
          type: "video",
          url: place.videos[prevIndex].downloadUrl,
        });
      }
    }
  };

  function handleEditBtnClick() {
    setIsEdit(true);
  }

  const handleMediaClick = (index: number, type: string) => {
    setCurrentIndex(index);
    setSelectedMedia({
      type,
      url:
        type === "image"
          ? place.images[index].downloadUrl
          : place.videos[index].downloadUrl,
    });
  };

  return place == undefined ? (
    <Loading />
  ) : isEdit ? (
    <HistoricalPlacesAddEdit isEdit={isEdit} place={place} />
  ) : (
    <div className="container mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 animate-slideInRight">
          {place?.placeName}
        </h2>
        <button
          className="btn btn-primary animate-bounce"
          onClick={handleEditBtnClick}
        >
          Edit
        </button>
      </div>

      {/* Description Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 animate-slideInLeft">
        <p className="text-lg text-gray-600">{place?.placeDescription}</p>
        <div className="text-sm text-gray-500 mt-2">
          <div
            className={`mt-4 badge ${
              place?.isActive ? "badge-success" : "badge-error"
            } animate-pulse`}
          >
            {place.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="h-64 w-full shadow-lg rounded-lg overflow-hidden animate-zoomIn">
        <GoogleMapComponent
          draggable={isEdit}
          onLocationSelect={handleLocationSelect}
          initialLatitude={
            parseFloat(placeDetails.placeLatitude.toString()) || undefined
          }
          initialLongitude={
            parseFloat(placeDetails.placeLongitude.toString()) || undefined
          }
        />
      </div>

      {/* Gallery Section */}
      <div className="animate-slideUp">
        <h3 className="text-2xl font-semibold mb-4">Gallery</h3>

        {/* Images Section */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {place.images.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer transform transition duration-500 hover:scale-105"
                onClick={() =>
                  setSelectedMedia({ type: "image", url: image.downloadUrl })
                }
              >
                <img
                  src={image.downloadUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-4">Videos</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {place.videos.map((video, index) => (
              <div
                key={index}
                className="relative cursor-pointer transform transition duration-500 hover:scale-105"
                onClick={() =>
                  setSelectedMedia({ type: "video", url: video.downloadUrl })
                }
              >
                <video
                  src={video.downloadUrl}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg">
                  <svg
                    className="text-white w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168L9.43 7.398a1 1 0 00-1.43.892v12.32a1 1 0 001.43.892l5.322-3.77a1 1 0 00.53-.866V12a1 1 0 00-.53-.866z"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Viewing Media */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeFullScreenView}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full h-auto cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
              onClick={closeFullScreenView}
            >
              ✕
            </button>
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt="Selected media"
                className="w-full h-auto max-h-[80vh] max-w-[80vw] object-contain"
              />
            ) : (
              <video
                controls
                src={selectedMedia.url}
                className="w-full h-auto max-h-[80vh] max-w-[80vw] object-contain"
              ></video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetailsPage;
