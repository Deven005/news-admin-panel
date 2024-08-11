"use client";
import InputField from "@/app/components/InputField";
import Loading from "@/app/components/Loading";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { NewsType } from "@/app/store/models/news/NewsModel";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NewsView = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { news, loading } = useStoreState((state) => state.news);
  const talukas = useStoreState((state) => state.taluka.talukas);
  const { changeNews, setLoading } = useStoreActions((state) => state.news);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("all");
  const [filteredNews, setFilteredNews] = useState<NewsType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await changeNews();
      } catch (err) {
        console.log("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [changeNews]);

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

    setFilteredNews(filtered);
  }, [news, searchTerm, selectedTaluka]);

  const handleEditNewsClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    news: NewsType
  ) => {
    e.stopPropagation();
    router.push(`${pathname}/update/${news.id}`);
  };

  const viewNewsHandler = (news: NewsType) =>
    router.push(`${pathname}/${news.id}`);

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
      <div className="flex justify-between items-center mb-4 px-7">
        <button
          onClick={() => router.push(`${pathname}/create`)}
          className="btn btn-primary"
        >
          Add New News
        </button>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <select
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">All Talukas</option>
            {talukas.map((taluka) => (
              <option key={taluka.id} value={taluka.id}>
                {taluka.talukaName}
              </option>
            ))}
          </select>
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
                <span className="font-semibold">Dislikes:</span> {item.dislikes}{" "}
                | <span className="font-semibold">Views:</span> {item.views}
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
      )}
    </>
  );
};

export default NewsView;
