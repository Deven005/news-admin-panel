"use client";
import Loading from "@/app/components/Loading";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useStoreState } from "@/app/hooks/hooks";
import Image from "next/image";

const NewsDetails = () => {
  const newsId = usePathname().split("/").pop();
  const news = useStoreState((state) => state.news.news);
  const newsItem = news.find((p) => p.id === newsId)!;

  const talukas = useStoreState((state) => state.taluka.talukas);
  const [selectedTaluka, setSelectedTaluka] = useState<string>(talukas[0]?.id);
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
    <div className="flex flex-col p-4 bg-gray-100 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
        {/* Title and Image */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
          <h1 className="text-2xl font-bold mb-2 p-4 bg-blue-500 text-white">
            {newsItem.title}
          </h1>
          <div className="relative w-full h-48 group">
            <Image
              src={newsItem.image}
              alt={newsItem.id}
              className="rounded-lg cursor-pointer transition-transform transform group-hover:scale-105 duration-300"
              onClick={handleImageClick}
              layout="fill"
              objectFit="cover"
              priority={true}
            />
          </div>
          <p className="p-4 text-gray-700 text-sm">{newsItem.description}</p>
        </section>

        {/* Details */}
        <section className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col gap-4">
          <div className="space-y-2 text-sm">
            {/* Taluka Section */}
            <div className="flex items-center gap-2">
              <strong>Taluka:</strong>
              <select
                aria-label="Select Taluka for news"
                value={selectedTaluka}
                disabled={true}
                onChange={handleCityChange}
                className="bg-white border border-gray-300 rounded-lg py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
              >
                {talukas.map((taluka, index) => (
                  <option key={index} value={taluka.id}>
                    {taluka.talukaName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Section */}
            <div className="flex items-center gap-2">
              <strong>Active:</strong> {newsItem.isActive ? "Yes" : "No"}
            </div>

            {/* Counts Section */}
            <div className="grid grid-cols-2 gap-2">
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
            </div>

            {/* Timestamps Section */}
            <div className="space-y-2">
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
            </div>

            {/* User Interactions Section */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <strong>Liked By Users:</strong> {newsItem.likedByUsers.length}
              </div>
              <div>
                <strong>Disliked By Users:</strong>{" "}
                {newsItem.disLikedByUsers.length}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={handleFullScreenClose}
        >
          <div className="relative max-w-screen-lg w-full h-full flex items-center justify-center p-2">
            <Image
              src={newsItem.image}
              alt={newsItem.id}
              className="w-full h-full object-contain rounded-lg"
              layout="intrinsic"
              width={800}
              height={600}
              priority={true}
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-1 transition-transform transform hover:scale-110 duration-300"
              onClick={handleFullScreenClose}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetails;
