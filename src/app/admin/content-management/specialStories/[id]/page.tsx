"use client";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { firestore } from "@/app/firebase/config";
import { useState, useEffect } from "react";
import { showToast } from "@/app/Utils/Utils";
import Loading from "@/app/components/Loading";

const SpecialStoryDetails = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();
  const [story, setStory] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        doc(firestore, "specialStories", id),
        (doc) => {
          setStory({ id: doc.id, ...doc.data() });
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateDoc(doc(firestore, "specialStories", id!), story);
      showToast("Story updated!", "s");
      setLoading(false);
      router.back();
    } catch (error) {
      setLoading(false);
      console.error("Failed to update story", error);
      showToast("Story not updated!", "e");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStory({ ...story, [e.target.name]: e.target.value });
  };

  return loading ? (
    <Loading />
  ) : !story ? (
    <div className="flex justify-center items-center h-full">
      <p className="text-xl">Story not found.</p>
    </div>
  ) : (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Special Story</h1>
      <form onSubmit={handleUpdate} className="card shadow-lg p-6 space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={story.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={story.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            required
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Image</span>
          </label>
          {story.image && (
            <div className="mb-4">
              <img
                src={story.image}
                alt="Story Image"
                className="rounded-lg w-full h-64 object-cover shadow-md"
              />
            </div>
          )}
        </div>

        <div className="form-control">
          <button type="submit" className="btn btn-primary w-full">
            Update Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecialStoryDetails;
