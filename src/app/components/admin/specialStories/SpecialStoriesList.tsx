import { useState, useEffect } from "react";
import Link from "next/link";
import { firestore } from "@/app/firebase/config";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import Loading from "../../Loading";
import { usePathname, useRouter } from "next/navigation";
import { doApiCall, showToast } from "@/app/Utils/Utils";

const SpecialStoriesList = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathName = usePathname();

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

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        setLoading(true);
        const response = await doApiCall({
          url: `/admin/special-stories/${id}`,
          callType: "d",
          formData: new FormData(),
        });
        if (!response.ok) {
          throw new Error(await response.json());
        }

        showToast(
          (await response.json())["message"] ?? "Story is deleted!",
          "s"
        );
        setStories(stories.filter((story) => story.id !== id));
      } catch (error: any) {
        console.error("Failed to delete story:", error);
        showToast(error["message"] ?? "Story is not deleted!", "e");
      } finally {
        setLoading(false);
      }
    }
  };

  const onEditViewClick = (id: string) => {
    router.push(`${pathName}/specialStories/${id}`);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Special Stories</h1>
        <Link
          href="/admin/content-management/specialStories/add"
          className="btn btn-primary"
        >
          Add New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="text-xl font-semibold mb-4">No stories found.</div>
          <Link
            href="/admin/content-management/specialStories/add"
            className="btn btn-secondary"
          >
            Add the First Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="card shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => onEditViewClick(story.id)}
            >
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
                    href={`${pathName}/specialStories/${story.id}`}
                    className="btn btn-outline"
                  >
                    View/Edit
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, story.id)}
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialStoriesList;
