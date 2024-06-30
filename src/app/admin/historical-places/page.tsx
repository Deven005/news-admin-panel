"use client";
import MyNavBar from "@/app/components/MyNavBar";
import { firestore } from "@/app/firebase/config";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { historicalPlaceCollectionName } from "@/app/Utils/Utils";
import { collection, onSnapshot } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HistoricalPlace } from "c:/Users/Deven/Desktop/Durgesh Work/news-admin-panel/src/app/store/models/historical-places/historicalPlacesModel";
import Loading from "@/app/components/Loading";

const HistoricalPlaces = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const historicalPlaces = useStoreState(
    (state) => state.historicalPlace.historicalPlaces
  );
  const changeInPlace = useStoreActions(
    (state) => state.historicalPlace.changeInPlace
  );

  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, historicalPlaceCollectionName),
      async (snapshot) => {
        setIsLoading(true);
        snapshot.docChanges().forEach((change) => {
          const placesData = change.doc.data();
          console.log(`placesData: `, placesData);
          changeInPlace({
            docID: change.doc.id,
            type: change.type,
            placesData: placesData,
          });
        });
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleEditPlaceClick = (place: HistoricalPlace) => {
    router.push(`${pathname}/${place.placeID}`);
  };

  const handleDeletePlaceClick = (place: HistoricalPlace) => {};

  return (
    <>
      <MyNavBar />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <button
            className="btn text-right"
            onClick={() => router.push(`${pathname}/create`)}
          >
            Add Place
          </button>
          {historicalPlaces && historicalPlaces.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Place Image</th>
                    <th>Place Name</th>
                    <th>Place Added</th>
                    <th>Place Updated</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {historicalPlaces.map((place, index) => {
                    return (
                      <tr key={index}>
                        <th>{index}</th>
                        <td>
                          <div className="avatar">
                            <div className="w-14 rounded-xl">
                              <img
                                src={
                                  place.images != undefined
                                    ? place?.images[0].downloadUrl
                                    : ""
                                }
                              />
                            </div>
                          </div>
                        </td>
                        <td>{place.placeName}</td>
                        <td>
                          {new Date(
                            place.placeCreatedAt.seconds * 1000 +
                              place.placeCreatedAt.nanoseconds / 1e6
                          ).toLocaleTimeString("en-US")}
                        </td>
                        <td>
                          {new Date(
                            place.placeUpdatedAt.seconds * 1000 +
                              place.placeUpdatedAt.nanoseconds / 1e6
                          ).toLocaleTimeString("en-US")}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={() => handleEditPlaceClick(place)}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-error"
                            data-te-ripple-init
                            data-te-ripple-color="dark"
                            onClick={() => handleDeletePlaceClick(place)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HistoricalPlaces;
