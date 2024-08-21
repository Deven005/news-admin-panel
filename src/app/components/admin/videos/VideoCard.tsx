import { Video } from "@/app/store/models/admin/videos/videosModel";
import React from "react";

interface VideoCardProps {
  video: Video;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onEdit, onDelete }) => {
  const {
    videoTitle,
    videoLikeCount,
    videoBookmarkCount,
    videoShareCount,
    videoViewCount,
    videoWhatsappShareCount,
    videoCreatedAt,
    videoFile: { downloadUrl },
  } = video;

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">{videoTitle}</h2>
        <video
          controls
          src={downloadUrl}
          className="w-full h-48 object-cover mb-4"
        />
        <div className="stats stats-vertical lg:stats-horizontal">
          <div className="stat">
            <div className="stat-title">Likes</div>
            <div className="stat-value">{videoLikeCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Bookmarks</div>
            <div className="stat-value">{videoBookmarkCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Shares</div>
            <div className="stat-value">{videoShareCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Views</div>
            <div className="stat-value">{videoViewCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">WhatsApp Shares</div>
            <div className="stat-value">{videoWhatsappShareCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Created At</div>
            <div className="stat-value">
              {new Date(videoCreatedAt.seconds * 1000).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            onClick={() => onEdit(video.videoID)}
            className="btn btn-primary"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(video.videoID)}
            className="btn btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
