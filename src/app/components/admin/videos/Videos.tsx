"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/components/Loading";
import { usePathname, useRouter } from "next/navigation";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";

const VideosPage: React.FC = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { videos, loading } = useStoreState((state) => state.video);
  const { getVideos, deleteVideo } = useStoreActions(
    (actions) => actions.video
  );

  useEffect(() => {
    getVideos();
    // const getVideos = async () => {
    //   const response = await doApiCall({
    //     url: `/reporter/videos`,
    //     callType: "g",
    //   });
    //   console.log("videos res: ", await response.json());
    // };
    // getVideos();
    // const unsubscribe = onSnapshot(
    //   collection(firestore, "videos"),
    //   (snapshot) => {
    //     const videosData: Video[] = snapshot.docs.map(
    //       (doc) => ({ ...doc.data() } as Video)
    //     );
    //     setVideos(videosData);
    //     setLoading(false);
    //   }
    // );
    // return () => unsubscribe();
  }, [getVideos]);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Do you want to delete?")) {
      await deleteVideo(id);
    }
  };

  const handleEditVideo = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`${pathName}/videos/${id}`);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Videos Management</h1>
        <Link href={`${pathName}/videos/add`} className="btn btn-primary">
          Add New Video
        </Link>
      </div>
      {videos.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-xl font-semibold">No videos found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.videoID}
              className="card bg-base-100 shadow-lg rounded-lg overflow-hidden"
              // onClick={() => handleEditVideo(video.videoID)}
            >
              <figure className="relative">
                <video
                  controls
                  src={video.videoFile.downloadUrl}
                  className="w-full h-48 object-cover"
                  itemID={video.videoID}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    // href={`${pathName}/videos/${video.videoID}`}
                    onClick={(e) => handleEditVideo(e, video.videoID)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, video.videoID)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-xl font-semibold">
                  {video.videoTitle}
                </h2>
                <p className="text-gray-600 mb-2">{`Hashtags: ${video.videoHashtag}`}</p>
                {/* <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="stat">
                    <div className="stat-title">Likes</div>
                    <div className="stat-value">{video.videoLikeCount}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Bookmarks</div>
                    <div className="stat-value">{video.videoBookmarkCount}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Shares</div>
                    <div className="stat-value">{video.videoShareCount}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Views</div>
                    <div className="stat-value">{video.videoViewCount}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">WhatsApp Shares</div>
                    <div className="stat-value">
                      {video.videoWhatsappShareCount}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p>{`Created At: ${new Date(
                    video.videoCreatedAt.seconds * 1000
                  ).toLocaleString()}`}</p>
                  <p>{`Updated At: ${new Date(
                    video.videoUpdatedAt.seconds * 1000
                  ).toLocaleString()}`}</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
