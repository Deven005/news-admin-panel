import React from "react";
import Image from "next/image";
import { formatDate } from "@/app/Utils/Utils";
import {
  PostRequirement,
  Media,
  Comment,
} from "@/app/store/models/admin/requirements/requirementModel";
import GoogleMapComponent from "@/app/components/google-map/GoogleMapComponent";

interface PostRequirementDetailsModalProps {
  isOpen: boolean;
  postRequirement: PostRequirement | null;
  onClose: () => void;
}

const PostRequirementDetailsModal: React.FC<
  PostRequirementDetailsModalProps
> = ({ isOpen, postRequirement, onClose }) => {
  if (!isOpen || !postRequirement) return null;

  // Extract media URLs by type
  const images = postRequirement.postReqMedias.filter(
    (media) => media.mediaType === "image"
  );
  const videos = postRequirement.postReqMedias.filter(
    (media) => media.mediaType === "video"
  );
  const audios = postRequirement.postReqMedias.filter(
    (media) => media.mediaType !== "video" && media.mediaType !== "image"
  );

  // Helper function for rendering media
  const renderMedia = (media: Media) => {
    if (media.mediaType === "image") {
      return (
        <Image
          src={media.mediaUrl}
          alt="Post Media"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      );
    } else if (media.mediaType === "video") {
      return (
        <video
          src={media.mediaUrl}
          controls
          className="rounded-lg w-full h-full object-cover"
        />
      );
    } else {
      return (
        <audio
          src={media.mediaUrl}
          controls
          className="w-full h-full object-contain"
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-5xl h-11/12 flex flex-col">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition z-10"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          </svg>
        </button>

        <div className="flex flex-col flex-1 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">
            {postRequirement.description}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-auto">
            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-auto">
                  {images.map((media) => (
                    <figure
                      key={media.mediaUrl}
                      className="relative h-32 mb-4 cursor-pointer"
                    >
                      {renderMedia(media)}
                    </figure>
                  ))}
                </div>
              </div>

              {videos && videos.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Videos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-auto">
                    {videos.map((media) => (
                      <figure
                        key={media.mediaUrl}
                        className="relative h-32 mb-4 cursor-pointer"
                      >
                        {renderMedia(media)}
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {audios.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Audios</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-auto">
                    {audios.map((media) => (
                      <figure
                        key={media.mediaUrl}
                        className="relative h-32 mb-4 cursor-pointer"
                      >
                        {renderMedia(media)}
                      </figure>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <div className="w-full h-64">
                  <GoogleMapComponent
                    draggable={false}
                    onLocationSelect={() => {}}
                    initialLatitude={postRequirement.location.latitude}
                    initialLongitude={postRequirement.location.longitude}
                  />
                </div>
                <p className="text-lg text-gray-700 mt-2">
                  Address: {postRequirement.location.address}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Contact/Whatsapp Number:{" "}
                  {postRequirement.contactOrWhatsappNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Posted By: {postRequirement.postedReqBy}
                </p>
                <p className="text-sm text-gray-500">
                  Requirement Category ID: {postRequirement.requirementCatID}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {postRequirement.type}
                </p>
              </div>

              {postRequirement.comments &&
                postRequirement.comments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2">Comments</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {postRequirement.comments.map((comment: Comment) => (
                        <li key={comment.commentId} className="mb-2">
                          <p>
                            <strong>{comment.commentedBy}</strong> commented:
                          </p>
                          <p>{comment.commentMessage}</p>
                          <p className="text-gray-500 text-xs">
                            Likes: {comment.likes} | Updated at:{" "}
                            {formatDate(comment.commentUpdatedTime)}
                          </p>
                          {comment.replies && comment.replies.length > 0 && (
                            <ul className="list-inside list-disc text-gray-600 text-xs mt-1">
                              {comment.replies.map((reply, index) => (
                                <li key={index}>{reply}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Created at: {formatDate(postRequirement.postReqCreatedAt)}
            </p>
            <p className="text-sm text-gray-500">
              Updated at: {formatDate(postRequirement.postReqUpdatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostRequirementDetailsModal;
