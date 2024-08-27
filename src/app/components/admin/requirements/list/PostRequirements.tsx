// components/PostRequirements.tsx
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useStoreState, useStoreActions } from "@/app/hooks/hooks";
import { motion } from "framer-motion";
import { calculateDistance, formatDate } from "@/app/Utils/Utils";
import PostRequirementDetailsModal from "./PostRequirementDetailsModal"; // Import the modal component
import { PostRequirement } from "@/app/store/models/admin/requirements/requirementModel";
import Loading from "@/app/components/Loading";

const PostRequirements: React.FC = () => {
  const { postRequirements, loading } = useStoreState(
    (state) => state.requirements
  );
  const { deletePostRequirement } = useStoreActions(
    (actions) => actions.requirements
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] =
    useState<keyof (typeof postRequirements)[0]>("postReqCreatedAt");
  const [selectedPost, setSelectedPost] = useState<PostRequirement | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userLocation = useMemo(
    () => ({ lat: 37.7749, lon: -122.4194 }), // Example user location (San Francisco)
    []
  );

  const filteredAndSortedRequirements = useMemo(() => {
    let filtered = postRequirements;

    if (searchTerm) {
      filtered = filtered.filter((post) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
          post.description.toLowerCase().includes(lowercasedTerm) ||
          post.location.address.toLowerCase().includes(lowercasedTerm)
        );
      });
    }

    filtered = filtered.sort((a, b) => {
      if (sortBy === "location" && userLocation) {
        const distanceA = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          a.location.latitude,
          a.location.longitude
        );
        const distanceB = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          b.location.latitude,
          b.location.longitude
        );
        return sortOrder === "asc"
          ? distanceA - distanceB
          : distanceB - distanceA;
      }

      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

    return filtered;
  }, [postRequirements, searchTerm, sortOrder, sortBy, userLocation]);

  const handleSort = (field: keyof (typeof postRequirements)[0]) => {
    setSortBy(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleOpenModal = (post: PostRequirement) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = async (postReqID: string) => {
    try {
      await deletePostRequirement(postReqID);
    } catch (error) {
      console.error("Error deleting post requirement:", error);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Post Requirements</h1>
        <p className="text-lg font-medium">
          Total Requirements:{" "}
          <span className="font-bold">
            {filteredAndSortedRequirements.length}
          </span>
        </p>
      </div>

      {/* Search and Sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Combined Search Input */}
        <input
          type="text"
          placeholder="Search by description, city, state, or pin code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg flex-1"
        />

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) =>
            handleSort(e.target.value as keyof (typeof postRequirements)[0])
          }
          className="p-2 border border-gray-300 rounded-lg flex-1"
        >
          <option value="postReqCreatedAt">Sort by Created At</option>
          <option value="description">Sort by Description</option>
          <option value="location">Sort by Proximity</option>
        </select>
      </div>

      {/* No Results Found UI */}
      {filteredAndSortedRequirements.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 rounded-lg shadow-lg">
          <div className="text-xl font-semibold mb-4">
            No Requirements Found
          </div>
          <div className="text-lg text-center mb-6">
            We couldn't find any requirements matching your criteria. Try
            adjusting your filters or search terms.
          </div>
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
            <Image
              src="/no-results-illustration.png" // Placeholder image URL
              alt="No Results"
              width={400}
              height={300}
              className="mx-auto mb-4"
            />
            <p className="text-gray-600 mb-4">
              It looks like we don't have any requirements that match your
              search. Please try adjusting your filters or search terms.
            </p>
          </div>
        </div>
      )}

      {/* Requirements Grid */}
      {filteredAndSortedRequirements.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRequirements.map((post) => (
            <motion.div
              key={post.postReqID}
              className="bg-white p-4 rounded-lg shadow-lg relative cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenModal(post)}
            >
              <figure className="relative h-32 mb-4">
                {post.postReqMedias[0]?.mediaType == "image" ? (
                  <Image
                    src={
                      post.postReqMedias[0]?.mediaUrl ||
                      "/placeholder-image.png"
                    }
                    alt="Post Media"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                ) : post.postReqMedias[0].mediaType == "video" ? (
                  <video
                    src={post.postReqMedias[0].mediaUrl}
                    controls
                    className="rounded-lg w-full h-full object-cover"
                    preload="true"
                  />
                ) : (
                  <Image
                    src={"/placeholder-image.png"}
                    alt="Post Media"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                )}
              </figure>
              <h3 className="text-xl font-semibold mb-2">{post.description}</h3>
              <p className="text-sm text-gray-500">
                Created at: {formatDate(post.postReqCreatedAt)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(post.postReqID);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
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
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Component */}
      <PostRequirementDetailsModal
        isOpen={isModalOpen}
        postRequirement={selectedPost!}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PostRequirements;
