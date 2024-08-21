import { doApiCall, showToast } from "@/app/Utils/Utils";
import { action, Action, thunk, Thunk } from "easy-peasy";

interface VideoFile {
  contentType: string;
  downloadUrl: string;
  filePath: string;
}

interface Video {
  videoID: string;
  videoTitle: string;
  videoHashtag: string;
  videoFile: VideoFile;
  videoCreatedAt: { seconds: number; nanoseconds: number };
  videoUpdatedAt: { seconds: number; nanoseconds: number };
  videoLikeCount: number;
  videoBookmarkCount: number;
  videoShareCount: number;
  videoViewCount: number;
  videoWhatsappShareCount: number;
  videoPostedBy: string;
  likedBy: string[];
  bookmarkedBy: string[];
  sharedBy: string[];
  viewedBy: string[];
  whatsappSharedBy: string[];
}

interface AddVideoType {
  videoHashtag: string;
  videoTitle: string;
  videoFile: File;
}

interface UpdateVideoType {
  id: string;
  videoHashtag?: string;
  videoTitle?: string;
  videoFile?: File | null;
}

export interface VideoModel {
  videos: Video[];
  getVideos: Thunk<VideoModel>;
  deleteVideo: Thunk<VideoModel, string>;
  addVideo: Thunk<VideoModel, AddVideoType>;
  updateVideo: Thunk<VideoModel, UpdateVideoType>;
  loading: boolean;
  setLoading: Action<VideoModel, boolean>;
}

const videoModel: VideoModel = {
  videos: [],
  getVideos: thunk(async (actions, _, { getState }) => {
    try {
      actions.setLoading(true);
      const response = await doApiCall({
        url: "/reporter/videos",
        callType: "g",
      });
      if (!response.ok) {
        throw await response.json();
      }
      const resJson = await response.json();
      console.log("video resJson: ", resJson);

      if ("videos" in resJson) {
        getState().videos = [
          ...resJson["videos"].map(
            (video: any) =>
              ({
                videoID: video.videoID,
                videoTitle: video.videoTitle,
                videoHashtag: video.videoHashtag,
                videoFile: {
                  contentType: video.videoFile?.contentType || "",
                  downloadUrl: video.videoFile?.downloadUrl || "",
                  filePath: video.videoFile?.filePath || "",
                },
                videoCreatedAt: {
                  seconds: video.videoCreatedAt?.seconds || 0,
                  nanoseconds: video.videoCreatedAt?.nanoseconds || 0,
                },
                videoUpdatedAt: {
                  seconds: video.videoUpdatedAt?.seconds || 0,
                  nanoseconds: video.videoUpdatedAt?.nanoseconds || 0,
                },
                videoLikeCount: video.videoLikeCount || 0,
                videoBookmarkCount: video.videoBookmarkCount || 0,
                videoShareCount: video.videoShareCount || 0,
                videoViewCount: video.videoViewCount || 0,
                videoWhatsappShareCount: video.videoWhatsappShareCount || 0,
                videoPostedBy: video.videoPostedBy || "",
                likedBy: video.likedBy || [],
                bookmarkedBy: video.bookmarkedBy || [],
                sharedBy: video.sharedBy || [],
                viewedBy: video.viewedBy || [],
                whatsappSharedBy: video.whatsappSharedBy || [],
              } as Video)
          ),
        ];
      } else {
        getState().videos = [];
      }
    } catch (error: any) {
      showToast(error["message"] ?? "Something is wrong!", "e");
      console.log("getVideos: err: ", error);
    } finally {
      actions.setLoading(false);
    }
  }),
  deleteVideo: thunk(async (actions, id, { getState }) => {
    try {
      actions.setLoading(true);

      const response = await doApiCall({
        url: `/reporter/videos/${id}`,
        callType: "d",
      });
      if (!response.ok) {
        throw new Error(await response.json());
      }
      getState().videos = getState().videos.filter(
        (video) => video.videoID !== id
      );

      showToast(
        (await response.json())["message"] ?? "Video deleted successfully!",
        "s"
      );
    } catch (error: any) {
      showToast(error["message"] ?? "Failed to delete video.", "e");
      console.error("Failed to delete video", error);
    } finally {
      actions.setLoading(false);
    }
  }),
  addVideo: thunk(async (actions, payload) => {
    try {
      const { videoTitle, videoHashtag, videoFile } = payload;
      actions.setLoading(true);

      const addViewForm = new FormData();

      addViewForm.append("videoTitle", videoTitle);
      addViewForm.append("videoHashtag", videoHashtag);
      addViewForm.append("video", videoFile);

      const response = await doApiCall({
        url: "/reporter/videos",
        callType: "",
        formData: addViewForm,
      });

      if (!response.ok) {
        throw new Error(await response.json());
      }

      showToast(
        (await response.json())["message"] ?? "Video added successfully!",
        "s"
      );
    } catch (error: any) {
      console.log("add video err: ", error);
      showToast(error["message"] ?? "Failed to add video!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  updateVideo: thunk(async (actions, payload) => {
    try {
      if (payload == null || payload == undefined) {
        throw new Error("No data found to update!");
      }
      actions.setLoading(true);

      const { id, videoTitle, videoHashtag, videoFile } = payload;

      const updateVideoForm = new FormData();
      if (videoTitle) updateVideoForm.append("videoTitle", videoTitle);
      if (videoHashtag) updateVideoForm.append("videoHashtag", videoHashtag);
      if (videoFile) updateVideoForm.append("video", videoFile);

      const response = await doApiCall({
        url: `/reporter/videos/${id}`,
        callType: "p",
        formData: updateVideoForm,
      });

      if (!response.ok) {
        throw new Error(await response.json());
      }

      showToast(
        (await response.json())["message"] ?? "Video updated successfully!",
        "s"
      );
    } catch (error: any) {
      showToast(error["message"] ?? "Failed to update video.", "e");
      console.error("Failed to update video", error);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
};

export { videoModel };
export type { Video, VideoFile };
