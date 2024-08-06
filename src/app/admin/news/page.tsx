"use client";
import Loading from "@/app/components/Loading";
import MyNavBar from "@/app/components/MyNavBar";
import { firestore } from "@/app/firebase/config";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { NewsType } from "@/app/store/models/news/NewsModel";
import { doApiCall, newsCollectionName } from "@/app/Utils/Utils";
import { query, collection, onSnapshot } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NewsView = () => {
  // const { news, loading } = useNews();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const news = useStoreState((state) => state.news.news);
  const changeNews = useStoreActions((state) => state.news.changeNews);

  useEffect(() => {
    const q = query(collection(firestore, newsCollectionName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const placesData = change.doc.data();
        console.log(`placesData: `, placesData);
        changeNews({
          docID: change.doc.id,
          type: change.type,
          placesData: placesData,
        });
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditNewsClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    news: NewsType
  ) => {
    e.stopPropagation();
    router.push(`${pathname}/update/${news.id}`);
  };

  const viewNewsHandler = (news: NewsType) => {
    router.push(`${pathname}/${news.id}`);
  };

  const handleDeleteNewsClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    news: NewsType
  ) => {
    e.stopPropagation();
    try {
      await doApiCall({
        url: `/reporter/news/${news.id}`,
        callType: "d",
        formData: new FormData(),
      });
    } catch (error) {
      console.log("news delete err");
    }
  };

  return (
    <>
      <MyNavBar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <button
            onClick={() => router.push(`${pathname}/create`)}
            className="btn btn-primary"
          >
            Add New News
          </button>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-4">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-center">Image</th>
                    <th className="p-3 text-center">Title</th>
                    <th className="p-3 text-center">Description</th>
                    <th className="p-3 text-center">Likes</th>
                    <th className="p-3 text-center">Dislikes</th>
                    <th className="p-3 text-center">Views</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item, index) => (
                    <tr
                      key={item.id}
                      className="transition-transform transform hover:scale-105 hover:shadow-lg"
                      style={{
                        animation: `slideIn ${index * 0.1 + 0.3}s ease-out`,
                      }}
                      onClick={() => viewNewsHandler(item)}
                    >
                      <td colSpan={7} className="p-4">
                        <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                          <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 relative overflow-hidden rounded-lg shadow-sm">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h2 className="text-lg font-semibold mb-2">
                                {item.title}
                              </h2>
                              <p className="text-gray-600 line-clamp-4">
                                {item.description}
                              </p>
                              <div className="mt-2 flex items-center space-x-4">
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Likes:</span>{" "}
                                  {item.likes}
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">
                                    Dislikes:
                                  </span>{" "}
                                  {item.dislikes}
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Views:</span>{" "}
                                  {item.views}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// export interface News {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   imagePath: string;
//   talukaID: string;
//   isActive: boolean;
//   likes: number;
//   dislikes: number;
//   views: number;
//   shares: number;
//   timestampCreatedAt: Date;
//   timestampUpdatedAt: Date;
//   likedByUsers: string[];
//   disLikedByUsers: string[];
// }
export default NewsView;
