import { action, Action } from "easy-peasy";
import firebase from "firebase/compat/app";
import { DocumentChangeType, DocumentData } from "firebase/firestore";

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
}

interface ChangeInHistoricalPlacesType {
  type: DocumentChangeType;
  docID: string;
  placesData: DocumentData;
}

interface HistoricalPlaceModel {
  historicalPlaces: HistoricalPlace[];

  changeInPlace: Action<HistoricalPlaceModel, ChangeInHistoricalPlacesType>;
}

const historicalPlaceModel: HistoricalPlaceModel = {
  historicalPlaces: [],
  changeInPlace: action((state, payload) => {
    const { type, docID, placesData } = payload;
    var changedPlaceIndex: number = state.historicalPlaces.findIndex(
      (val) => val.placeID == docID
    );

    switch (type) {
      case "added":
        if (changedPlaceIndex == -1) {
          state.historicalPlaces.push({
            placeID: docID,
            placeCreatedAt: placesData["placeCreatedAt"],
            placeDescription: placesData["placeDescription"],
            images: placesData["images"],
            videos: placesData["videos"],
            placeName: placesData["placeName"],
            placeShow: placesData["placeShow"],
            placeUpdatedAt: placesData["placeUpdatedAt"],
          });
        }
        break;
      case "modified":
        if (changedPlaceIndex !== -1) {
          state.historicalPlaces[changedPlaceIndex] = {
            placeID: docID,
            placeCreatedAt: placesData["placeCreatedAt"],
            placeDescription: placesData["placeDescription"],
            images: placesData["images"],
            videos: placesData["videos"],
            placeName: placesData["placeName"],
            placeShow: placesData["placeShow"],
            placeUpdatedAt: placesData["placeUpdatedAt"],
          };
        }
        break;
      case "removed":
        if (changedPlaceIndex !== -1) {
          state.historicalPlaces.splice(changedPlaceIndex, 1);
        }
        break;
    }
  }),
};

export { historicalPlaceModel };
export type { HistoricalPlace, HistoricalPlaceModel };
