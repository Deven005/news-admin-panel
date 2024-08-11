"use client";
import Loading from "@/app/components/Loading";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useStoreState } from "@/app/hooks/hooks";

const EditNewsView = () => {
  const newsId = usePathname().split("/").pop();
  const news = useStoreState((state) => state.news.news);
  const newsItem = news.find((p) => p.id === newsId)!;

  const talukas = useStoreState((state) => state.taluka.talukas);
  const [selectedTaluka, setSelectedTaluka] = useState<string>(talukas[0].id);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaluka(event.target.value);
  };

  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const handleFullScreenClose = () => {
    setIsFullScreen(false);
  };

  return news == null || newsItem == null ? (
    <Loading />
  ) : (
    <>
      <div className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {newsItem.title}
        </h1>
        <img
          src={newsItem.image}
          alt={newsItem.id}
          className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer"
          onClick={handleImageClick}
        />
        <div className="overflow-hidden">
          <p className="text-gray-700 mb-4 overflow-auto max-h-40">
            {newsItem.description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong>Image Path:</strong> {newsItem.imagePath}
          </div>
          <div>
            Taluka:
            <div className="flex justify-between items-center text-gray-600">
              <div className="relative">
                <select
                  aria-label="Select Taluka for news"
                  value={selectedTaluka}
                  disabled={true}
                  onChange={handleCityChange}
                  className="bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {talukas.map((taluka, index) => (
                    <option key={index} value={taluka.id}>
                      {taluka.talukaName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <strong>Active:</strong> {newsItem.isActive ? "Yes" : "No"}
          </div>
          <div>
            <strong>Likes:</strong> {newsItem.likes}
          </div>
          <div>
            <strong>Dislikes:</strong> {newsItem.dislikes ?? 0}
          </div>
          <div>
            <strong>Views:</strong> {newsItem.views}
          </div>
          <div>
            <strong>Shares:</strong> {newsItem.shares}
          </div>
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(
              newsItem.timestampCreatedAt.seconds * 1000 +
                newsItem.timestampCreatedAt.nanoseconds / 1e6
            ).toLocaleString("en-US")}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(
              newsItem.timestampUpdatedAt.seconds * 1000 +
                newsItem.timestampUpdatedAt.nanoseconds / 1e6
            ).toLocaleString("en-US")}
          </div>
          <div>
            <strong>Liked By Users:</strong> {newsItem.likedByUsers.length}
          </div>
          <div>
            <strong>Disliked By Users:</strong>{" "}
            {newsItem.disLikedByUsers.length}
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={handleFullScreenClose}
        >
          <img
            src={newsItem.image}
            alt={newsItem.id}
            className="w-full h-auto max-h-full object-contain rounded-lg"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={handleFullScreenClose}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};

export default EditNewsView;
