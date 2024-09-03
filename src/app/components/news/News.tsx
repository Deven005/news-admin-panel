"use client";
import Loading from "@/app/components/Loading";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { NewsType } from "@/app/store/models/news/NewsModel";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const News = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { news, loading } = useStoreState((state) => state.news);
  const talukas = useStoreState((state) => state.taluka.talukas);
  const { setLoading } = useStoreActions((state) => state.news);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("all");
  const [sortBy, setSortBy] = useState<string>("timestampCreatedAt"); // Sorting criteria
  const [filteredNews, setFilteredNews] = useState<NewsType[]>([]);

  useEffect(() => {
    let filtered = news;

    if (selectedTaluka !== "all") {
      filtered = filtered.filter((item) => item.talukaID === selectedTaluka);
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.sort((a, b) => {
      if (sortBy === "timestampCreatedAt") {
        // Convert Timestamp objects to Date for comparison
        const aDate = a.timestampCreatedAt.toDate();
        const bDate = b.timestampCreatedAt.toDate();
        return bDate.getTime() - aDate.getTime(); // Descending order (latest first)
      } else if (sortBy === "likes") {
        return (Number(b.likes) || 0) - (Number(a.likes) || 0); // Descending order (most likes first)
      } else if (sortBy === "dislikes") {
        return (Number(b.dislikes) || 0) - (Number(a.dislikes) || 0); // Descending order (most dislikes first)
      } else if (sortBy === "views") {
        return (Number(b.views) || 0) - (Number(a.views) || 0); // Descending order (most views first)
      } else if (sortBy === "shares") {
        return (Number(b.shares) || 0) - (Number(a.shares) || 0); // Descending order (most shares first)
      } else {
        return 0; // No sorting
      }
    });

    setFilteredNews(filtered);
  }, [news, searchTerm, selectedTaluka, sortBy]);

  const handleEditNewsClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    news: NewsType
  ) => {
    e.stopPropagation();
    router.push(`${pathname}/news/update/${news.id}`);
  };

  const viewNewsHandler = (news: NewsType) =>
    router.push(`${pathname}/news/${news.id}`);

  const handleDeleteNewsClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    news: NewsType
  ) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await doApiCall({
        url: `/reporter/news/${news.id}`,
        callType: "d",
        formData: new FormData(),
      });
      setLoading(false);
      showToast(`Deleted!`, "s");
    } catch (error) {
      setLoading(false);
      console.log("news delete err");
      showToast(`Not Deleted!`, "s");
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="mb-4 px-7 pt-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
      {/* Add New News Button */}
      <button
        onClick={() => router.push(`${pathname}/news/create`)}
        className="btn btn-primary col-span-1 py-1 px-3 text-sm font-medium"
      >
        Add New News
      </button>

      {/* Search Input */}
      <div className="col-span-1">
        <input
          type="text"
          placeholder="Search by title..."
          className="input input-bordered w-full text-lg py-4 px-5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters and Sorting */}
      <div className="col-span-2 flex flex-col sm:flex-row gap-4">
        {/* Taluka Filter */}
        <div className="flex-1">
          <select
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            className="select select-bordered w-full text-sm py-1 px-2"
          >
            <option value="all">All Talukas</option>
            {talukas.map((taluka) => (
              <option key={taluka.id} value={taluka.id}>
                {taluka.talukaName}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select select-bordered w-full text-sm py-1 px-2"
          >
            <option value="timestampCreatedAt">Newest First</option>
            <option value="likes">Most Likes</option>
            <option value="dislikes">Most Dislikes</option>
            <option value="views">Most Views</option>
            <option value="shares">Most Shares</option>
          </select>
        </div>
      </div>
    </div>

      {filteredNews.length === 0 ? (
        <div
          className="flex items-center justify-center text-center"
          style={{ height: "70vh" }}
        >
          <div className="p-6 bg-base-100 shadow-xl rounded">
            <h2 className="text-xl font-bold">
              No news found! You can add news.
            </h2>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredNews.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg"
                style={{
                  animation: `slideIn ${index * 0.1 + 0.3}s ease-out`,
                }}
                onClick={() => viewNewsHandler(item)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-sm mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    height={200}
                    width={200}
                    priority={true}
                  />
                </div>
                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {item.description}
                </p>
                <div className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold">Likes:</span> {item.likes} |{" "}
                  <span className="font-semibold">Dislikes:</span>{" "}
                  {item.dislikes ?? "0"} |{" "}
                  <span className="font-semibold">Views:</span> {item.views}
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(
                    item.timestampCreatedAt.seconds * 1000 +
                      item.timestampCreatedAt.nanoseconds / 1e6
                  ).toLocaleString("en-US")}
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold">Updated At:</span>{" "}
                  {new Date(
                    item.timestampUpdatedAt.seconds * 1000 +
                      item.timestampUpdatedAt.nanoseconds / 1e6
                  ).toLocaleString("en-US")}
                </div>
                <div className="flex justify-between">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => handleEditNewsClick(e, item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={(e) => handleDeleteNewsClick(e, item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default News;
