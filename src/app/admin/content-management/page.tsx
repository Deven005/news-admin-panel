"use client";
import SpecialStoriesList from "@/app/components/admin/specialStories/SpecialStoriesList";
import HistoricalPlaces from "@/app/components/historical-places/HistoricalPlaces";
import News from "@/app/components/news/News";
import { useState } from "react";

const ContentManagement = () => {
  const [selectedContentType, setSelectedContentType] = useState<
    "news" | "historicalPlaces" | "specialStories" | "advertisements"
  >("news");

  const handleContentTypeChange = (type: typeof selectedContentType) => {
    setSelectedContentType(type);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Content Management
      </h1>
      <div className="tabs tabs-boxed justify-center mb-8">
        <a
          className={`tab tab-lg tab-lifted ${
            selectedContentType === "news" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("news")}
        >
          News
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedContentType === "historicalPlaces" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("historicalPlaces")}
        >
          Historical Places
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedContentType === "specialStories" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("specialStories")}
        >
          Special Stories
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedContentType === "advertisements" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("advertisements")}
        >
          Advertisements
        </a>
      </div>
      <div className="card bg-base-100 shadow-lg p-6">
        {selectedContentType === "news" ? (
          <News />
        ) : selectedContentType === "historicalPlaces" ? (
          <HistoricalPlaces />
        ) : selectedContentType === "specialStories" ? (
          <SpecialStoriesList />
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-xl">Coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
