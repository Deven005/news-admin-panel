import { firestore } from "@/app/firebase/config";
import { advertisesCollectionName } from "@/app/Utils/Utils";
import { collection, onSnapshot } from "firebase/firestore";
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

  function onEditViewClickHandler(id: string) {
    router.push(`${pathName}/advertise/${id}`);
  }

  return loading ? (
    <Loading />
  ) : advertises.length === 0 ? (
    <div className="flex justify-center items-center h-full">
      <div className="text-xl">No Advertises Found.</div>
    </div>
  ) : (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Advertises List</h1>
        <button
          onClick={() => router.push(`${pathName}/advertise/add`)}
          className="btn btn-primary"
        >
          + Add New Advertise
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertises.map((advertise) => (
          <div
            key={advertise.advertiseId}
            className="card shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => onEditViewClickHandler(advertise.advertiseId)}
          >
            <div className="relative h-40">
              <Image
                src={advertise.advertiseImg.downloadUrl}
                alt="Advertise Image"
                layout="fill"
                className="rounded-lg object-contain"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advertises;
