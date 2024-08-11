import { firestore } from "@/app/firebase/config";
import { doApiCall, historicalPlaceCollectionName } from "@/app/Utils/Utils";
import { action, Action, thunk, Thunk } from "easy-peasy";
import firebase from "firebase/compat/app";
import {
  collection,
  DocumentChangeType,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";

interface FileType {
  downloadUrl: string;
  filePath: string;
}

interface HistoricalPlace {
  placeID: string;
  placeDescription: string;
  placeName: string;
  images: FileType[];
  videos: FileType[];
  placeCreatedAt: firebase.firestore.Timestamp;
  placeUpdatedAt: firebase.firestore.Timestamp;
  placeShow: boolean;
  isActive: boolean;
  placeLatitude: number;
  placeLongitude: number;
}

interface ChangeInHistoricalPlacesType {
  type: DocumentChangeType;
  docID: string;
  placesData: DocumentData;
}

interface HistoricalPlaceModel {
  historicalPlaces: HistoricalPlace[];
  listenPlaceChange: Thunk<HistoricalPlaceModel>;
  deleteHistoricalPlace: Thunk<HistoricalPlaceModel, string>;
  isLoading: boolean;
  setLoading: Action<HistoricalPlaceModel, boolean>;
}

const historicalPlaceModel: HistoricalPlaceModel = {
  historicalPlaces: [],
  deleteHistoricalPlace: thunk(async (actions, id) => {
    console.log("delete place ID: ", id);

    try {
      actions.setLoading(true);
      const response = await doApiCall({
        url: `/admin/historical-places/${id}`,
        callType: "d",
        formData: new FormData(),
      });
      console.log("place delete res: ", response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  listenPlaceChange: thunk(async (actions, _, { getState }) => {
    try {
      actions.setLoading(true);
      const unsubscribe = onSnapshot(
        collection(firestore, historicalPlaceCollectionName),
        (snapshot) => {
          actions.setLoading(true);
          getState().historicalPlaces = [
            ...(snapshot.docs.map((doc) => ({
              placeID: doc.id,
              ...doc.data(),
            })) as HistoricalPlace[]),
          ];
          actions.setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching Talukas:", error);
    }
  }),
  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
};

export { historicalPlaceModel };
export type { HistoricalPlace, HistoricalPlaceModel };
