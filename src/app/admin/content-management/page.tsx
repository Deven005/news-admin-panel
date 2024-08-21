"use client";
import Advertises from "@/app/components/admin/advertises/Advertises";
import SpecialStoriesList from "@/app/components/admin/specialStories/SpecialStoriesList";
import Videos from "@/app/components/admin/videos/Videos";
import HistoricalPlaces from "@/app/components/historical-places/HistoricalPlaces";
import News from "@/app/components/news/News";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ContentManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedContentType, setSelectedContentType] = useState<
    "news" | "historicalPlaces" | "specialStories" | "advertisements" | "videos"
  >("news");
  const [children, setChildren] = useState<JSX.Element>();

  const handleContentTypeChange = (type: typeof selectedContentType) => {
    setSelectedContentType(type);
    switch (type) {
      case "advertisements":
        setChildren(<Advertises />);
        break;

      case "historicalPlaces":
        setChildren(<HistoricalPlaces />);
        break;

      case "news":
        setChildren(<News />);
        break;

      case "specialStories":
        setChildren(<SpecialStoriesList />);
        break;

      case "videos":
        setChildren(<Videos />);
        break;

      default:
        setChildren(<p>Default View!</p>);
        break;
    }
    router.push(`?contentType=${type}`);
  };

  useEffect(() => {
    const type = searchParams.get("contentType") as
      | "news"
      | "historicalPlaces"
      | "specialStories"
      | "advertisements"
      | "videos"
      | null;
    if (type) {
      handleContentTypeChange(type);
    } else {
      handleContentTypeChange("specialStories");
    }
  }, [searchParams]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Content Management
      </h1>
      <div className="tabs tabs-boxed justify-center mb-8">
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
            selectedContentType === "news" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("news")}
        >
          News
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedContentType === "videos" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("videos")}
        >
          Videos
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
            selectedContentType === "advertisements" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("advertisements")}
        >
          Advertisements
        </a>
      </div>
      <div className="card bg-base-100 shadow-lg p-6">
        {children}
        {/* {selectedContentType === "news" ? (
          <News />
        ) : selectedContentType === "historicalPlaces" ? (
          <HistoricalPlaces />
        ) : selectedContentType === "specialStories" ? (
          <SpecialStoriesList />
        ) : selectedContentType === "advertisements" ? (
          <Advertises />
        ) : (
          <p>Coming soon!</p>
        )} */}
      </div>
    </div>
  );
};

export default ContentManagement;
