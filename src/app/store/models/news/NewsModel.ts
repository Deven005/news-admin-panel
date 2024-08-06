import { action, Action } from "easy-peasy";
import { DocumentChangeType, DocumentData } from "firebase/firestore";

interface NewsType {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePath: string;
  talukaID: string;
  isActive: boolean;
  likes: number;
  dislikes: number;
  views: number;
  shares: number;
  timestampCreatedAt: Date;
  timestampUpdatedAt: Date;
  likedByUsers: string[];
  disLikedByUsers: string[];
}

interface ChangeInNewsType {
  type: DocumentChangeType;
  docID: string;
  placesData: DocumentData;
}

export interface NewsTypeModel {
  news: NewsType[];
  changeNews: Action<NewsTypeModel, ChangeInNewsType>;
}

const newsModel: NewsTypeModel = {
  news: [],
  changeNews: action((state, payload) => {
    const { type, docID, placesData } = payload;
    var changedPlaceIndex: number = state.news.findIndex(
      (val) => val.id == docID
    );

    switch (type) {
      case "added":
        if (changedPlaceIndex == -1) {
          state.news.push({
            id: docID,
            title: placesData["title"],
            description: placesData["description"],
            isActive: placesData["isActive"],
            image: placesData["image"],
            talukaID: placesData["talukaID"],
            imagePath: placesData["imagePath"],
            likes: placesData["likes"],
            dislikes: placesData["dislikes"],
            views: placesData["views"],
            shares: placesData["shares"],
            timestampCreatedAt: placesData["timestampCreatedAt"],
            timestampUpdatedAt: placesData["timestampUpdatedAt"],
            likedByUsers: placesData["likedByUsers"],
            disLikedByUsers: placesData["disLikedByUsers"],
          });
        }
        break;
      case "modified":
        if (changedPlaceIndex !== -1) {
          state.news[changedPlaceIndex] = {
            id: docID,
            title: placesData["title"],
            description: placesData["description"],
            isActive: placesData["isActive"],
            image: placesData["image"],
            talukaID: placesData["talukaID"],
            imagePath: placesData["imagePath"],
            likes: placesData["likes"],
            dislikes: placesData["dislikes"],
            views: placesData["views"],
            shares: placesData["shares"],
            timestampCreatedAt: placesData["timestampCreatedAt"],
            timestampUpdatedAt: placesData["timestampUpdatedAt"],
            likedByUsers: placesData["likedByUsers"],
            disLikedByUsers: placesData["disLikedByUsers"],
          };
        }
        break;
      case "removed":
        if (changedPlaceIndex !== -1) {
          state.news.splice(changedPlaceIndex, 1);
        }
        break;
    }
  }),
};

export { newsModel };
export type { NewsType };
