"use client";
import React, { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";

const VideoEdit = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the file input
  const router = useRouter();
  const pathName = usePathname();
  const id = pathName.split("/").pop();
  const { videos, loading } = useStoreState((states) => states.video);
  const video = videos.find((p) => p.videoID === id)!;
  const [videoTitle, setVideoTitle] = useState(video?.videoTitle || "");
  const [videoHashtag, setVideoHashtag] = useState(video?.videoHashtag || "");
  const { updateVideo } = useStoreActions((actions) => actions.video);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateVideo({
        id: video.videoID,
        videoTitle,
        videoHashtag,
        videoFile,
      });
      router.back();
    } catch (error) {}
  };

  const handleRemoveVideoFile = () => {
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Video</h1>
      <form onSubmit={handleSubmit} className="card shadow-lg p-6">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Hashtags</span>
          </label>
          <input
            type="text"
            value={videoHashtag}
            onChange={(e) => setVideoHashtag(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef} // Set ref to the file input
            onChange={(e) =>
              setVideoFile(e.target.files ? e.target.files[0] : null)
            }
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div className="form-control mb-4">
          {videoFile ? (
            <div className="relative">
              <video
                controls
                src={URL.createObjectURL(videoFile)}
                className="w-full h-auto rounded-lg"
                preload="true"
                itemID={video.videoID}
              />
              <button
                type="button"
                onClick={handleRemoveVideoFile}
                className="absolute top-2 right-2 btn btn-xs btn-error"
              >
                ✕
              </button>
            </div>
          ) : video?.videoFile?.downloadUrl ? (
            <div className="relative">
              <video
                controls
                src={video.videoFile.downloadUrl}
                className="w-full h-auto rounded-lg"
              />
            </div>
          ) : (
            <p>No video available.</p>
          )}
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">
            Update Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoEdit;
