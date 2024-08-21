"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";

const AddVideoPage: React.FC = () => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoHashtag, setVideoHashtag] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { loading } = useStoreState((states) => states.video);
  const { addVideo } = useStoreActions((actions) => actions.video);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Select video file!");
      return;
    }

    try {
      await addVideo({ videoTitle, videoHashtag, videoFile });
      router.back();
    } catch (error: any) {}
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Video</h1>
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
            onChange={(e) =>
              setVideoFile(e.target.files ? e.target.files[0] : null)
            }
            className="file-input file-input-bordered w-full"
            required
          />
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">
            Add Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVideoPage;
