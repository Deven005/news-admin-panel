"use client";
import { useState } from "react";
import { firestore } from "@/app/firebase/config";
import { addDoc, collection, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/Utils/Utils";
import Loading from "@/app/components/Loading";

const AddSpecialStory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStory = {
      title,
      description,
      image,
      shareCount: 0,
      whatsappShareCount: 0,
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      await addDoc(collection(firestore, "specialStories"), newStory);
      router.back();
      showToast("Story added!", "s");
    } catch (error) {
      showToast("Story not added!", "e");
      setLoading(false);
      console.error("Failed to add story", error);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Special Story</h1>
      <form onSubmit={handleSubmit} className="card shadow-lg p-6">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            required
          ></textarea>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Image URL</span>
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <button type="submit" className="btn btn-primary w-full">
            Add Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpecialStory;
