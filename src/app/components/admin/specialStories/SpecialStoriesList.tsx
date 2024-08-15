import { useState, useEffect } from "react";
import Link from "next/link";
import { firestore } from "@/app/firebase/config";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import Loading from "../../Loading";

const SpecialStoriesList = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "specialStories"),
      async (snapshot) => {
        const storiesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(storiesData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await deleteDoc(doc(firestore, "specialStories", id));
        setStories(stories.filter((story) => story.id !== id));
      } catch (error) {
        console.error("Failed to delete story:", error);
      }
    }
  };

  return loading ? (
    <Loading />
  ) : stories.length === 0 ? (
    <div className="flex justify-center items-center h-full">
      <div className="text-xl font-semibold">No stories found.</div>
    </div>
  ) : (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Special Stories</h1>
        <Link href="/admin/content-management/specialStories/add">
          Add New Story
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="card shadow-lg">
            <figure>
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{story.title}</h2>
              <p className="truncate">{story.description}</p>
              <div className="card-actions justify-end">
                <Link
                  href={`/admin/content-management/specialStories/${story.id}`}
                >
                  View/Edit
                </Link>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialStoriesList;
