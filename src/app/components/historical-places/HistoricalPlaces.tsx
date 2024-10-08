"use client";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import { HistoricalPlace } from "@/app/store/models/historical-places/historicalPlacesModel";
import { showToast } from "@/app/Utils/Utils";
import Image from "next/image";

const HistoricalPlaces = () => {
  const router = useRouter();
  const { historicalPlaces, isLoading } = useStoreState(
    (state) => state.historicalPlace
  );
  const { deleteHistoricalPlace } = useStoreActions(
    (state) => state.historicalPlace
  );

  const pathname = usePathname();

  const handleEditPlaceClick = (place: HistoricalPlace) =>
    router.push(`${pathname}/historical-places/${place.placeID}`);

  const handleDeletePlaceClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    place: HistoricalPlace
  ) => {
    e.stopPropagation();
    try {
      await deleteHistoricalPlace(place.placeID);
      showToast("delete is done", "s");
    } catch (error: any) {
      console.log("handleDeletePlaceClick err: ", error);
      showToast(error?.message ?? "Something is wrong!", "e");
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <button
        className="btn text-right mb-4"
        onClick={() => router.push(`${pathname}/historical-places/create`)}
      >
        Add Place
      </button>
      {historicalPlaces && historicalPlaces.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra text-center">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th></th>
                <th>Place Image</th>
                <th>Place Name</th>
                <th>Place Description</th>
                <th>Place Added</th>
                <th>Place Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {historicalPlaces.map((place, index) => (
                <tr
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleEditPlaceClick(place)}
                >
                  <th>{index + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="w-14 rounded-xl overflow-hidden">
                        <Image
                          height={100}
                          width={100}
                          src={
                            place.images && place.images.length > 0
                              ? place.images[0].downloadUrl
                              : "/default-image.jpg" // Default image if none exists
                          }
                          alt={place.placeName}
                          className="object-cover w-full h-full"
                          priority={true}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{place.placeName}</td>
                  <td className="max-w-xs">
                    <p className="line-clamp-3">
                      {place.placeDescription || "No description"}
                    </p>
                  </td>
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
                  <td className="flex justify-center space-x-2">
                    <button
                      className="btn btn-outline btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPlaceClick(place);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={(e) => handleDeletePlaceClick(e, place)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8">
          <p className="text-lg text-gray-500">
            No historical places found. Add a new place to get started!
          </p>
        </div>
      )}
    </>
  );
};

export default HistoricalPlaces;
