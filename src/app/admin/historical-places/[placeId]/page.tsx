"use client";
import HistoricalPlacesAddEdit from "@/app/components/historical-places/create-or-edit/HistoricalPlacesAddEdit";
import { useStoreState } from "@/app/hooks/hooks";
import { usePathname } from "next/navigation";

const PlaceDetailsPage: React.FC = () => {
  const pathname = usePathname();
  const placeID = pathname.split("/").pop();

  const historicalPlaces = useStoreState(
    (state) => state.historicalPlace.historicalPlaces
  );
  const place = historicalPlaces.find((p) => p.placeID === placeID);

  return (
    <>
      {/* Render other details of the place */}
      <HistoricalPlacesAddEdit isEdit={true} place={place} />
    </>
  );
};

export default PlaceDetailsPage;
