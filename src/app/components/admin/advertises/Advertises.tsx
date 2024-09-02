import { firestore } from "@/app/firebase/config";
import { advertisesCollectionName, showToast } from "@/app/Utils/Utils";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import { usePathname, useRouter } from "next/navigation";

export interface AdvertiseType {
  advertiseId: string;
  advertiseCreatedAt: any;
  advertiseImg: {
    downloadUrl: string;
    filePath: string;
  };
  advertiseUpdatedAt: any;
}

const Advertises = () => {
  const [loading, setLoading] = useState(true);
  const [advertises, setAdvertises] = useState<AdvertiseType[]>([]);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(firestore, advertisesCollectionName),
      (snapshot) => {
        setAdvertises(
          snapshot.docs.map((doc) => ({
            advertiseId: doc.id,
            ...doc.data(),
          })) as AdvertiseType[]
        );
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const onEditViewClickHandler = (id: string) => {
    router.push(`${pathName}/advertise/${id}`);
  };

  const onDeleteClickHandler = async (advertiseId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this advertise?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteDoc(doc(firestore, advertisesCollectionName, advertiseId));
      showToast("Advertise deleted successfully", "s");
    } catch (error) {
      console.error("Error deleting advertise: ", error);
      showToast("Failed to delete advertise", "e");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Add New Advertise Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Advertises List</h1>
        {!loading && (
          <button
            onClick={() => router.push(`${pathName}/advertise/add`)}
            className="btn btn-primary ml-5"
          >
            + Add New Advertise
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loading />
        </div>
      ) : advertises.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <div className="text-xl text-gray-600">No Advertises Found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertises.map((advertise) => (
            <div
              key={advertise.advertiseId}
              className="card shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-40">
                <Image
                  src={advertise.advertiseImg.downloadUrl}
                  alt="Advertise Image"
                  layout="fill"
                  className="rounded-lg object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-bold truncate">
                  Advertise ID: {advertise.advertiseId}
                </h2>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(
                    advertise.advertiseCreatedAt.seconds * 1000
                  ).toLocaleString("en-US")}
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Updated At:</span>{" "}
                  {new Date(
                    advertise.advertiseUpdatedAt.seconds * 1000
                  ).toLocaleString("en-US")}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      onEditViewClickHandler(advertise.advertiseId)
                    }
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClickHandler(advertise.advertiseId);
                    }}
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

export default Advertises;
