"use client";
import Loading from "@/app/components/Loading";
import MyNavBar from "@/app/components/MyNavBar";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useStoreState } from "@/app/hooks/hooks";
import { NewsType } from "@/app/store/models/news/NewsModel";
import Image from "next/image";

const EditNewsView = () => {
  const newsId = usePathname().split("/").pop();
  const [isEditing, setIsEditing] = useState<string>("");
  const news = useStoreState((state) => state.news.news);
  const newsItem = news.find((p) => p.id === newsId)!;

  useEffect(() => {
    if (newsId) {
      const queryParams = new URLSearchParams(window.location.search);
      const newsData: NewsType = {
        id: newsId,
        title: queryParams.get("title") || "",
        talukaID: queryParams.get("talukaID") || "",
        description: queryParams.get("description") || "",
        image: queryParams.get("image") || "",
        imagePath: queryParams.get("imagePath") || "",
        isActive: queryParams.get("isActive") === "true",
        likes: Number(queryParams.get("likes") || 0),
        dislikes: Number(queryParams.get("dislikes") || 0),
        views: Number(queryParams.get("views") || 0),
        timestampCreatedAt: new Date(
          queryParams.get("timestampCreatedAt") || ""
        ),
        timestampUpdatedAt: new Date(
          queryParams.get("timestampUpdatedAt") || ""
        ),
        disLikedByUsers: [],
        likedByUsers: [],
        shares: 0,
      };
      setIsEditing(queryParams.get("isEditing") || "");
    }
  }, [newsId]);
  return news == null || newsItem == null ? (
    <Loading />
  ) : (
    <>
      <MyNavBar />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">{newsItem.title}</h1>
        <img
          src={newsItem.image}
          alt="News"
          className="w-full h-48 object-cover mb-4"
        />
        <p className="text-gray-700 mb-4">{newsItem.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-600">Views: {newsItem.views}</span>
            <span className="text-gray-600 ml-4">Likes: {newsItem.likes}</span>
            <span className="text-gray-600 ml-4">
              Shares: {newsItem.shares}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditNewsView;
