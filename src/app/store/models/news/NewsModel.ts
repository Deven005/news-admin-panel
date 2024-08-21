import { firestore } from "@/app/firebase/config";
import { newsCollectionName } from "@/app/Utils/Utils";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { collection, onSnapshot } from "firebase/firestore";
import firebase from "firebase/compat/app";

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
  timestampCreatedAt: firebase.firestore.Timestamp;
  timestampUpdatedAt: firebase.firestore.Timestamp;
  likedByUsers: string[];
  disLikedByUsers: string[];
}

export interface NewsTypeModel {
  loading: boolean;
  setLoading: Action<NewsTypeModel, boolean>;
  news: NewsType[];
  setNews: Action<NewsTypeModel, NewsType[]>;
  listenChangeNews: Thunk<NewsTypeModel>;
}

const newsModel: NewsTypeModel = {
  news: [],
  setNews: action((state, payload) => {
    state.news = payload;
  }),
  listenChangeNews: thunk((actions) => {
    actions.setLoading(true);
    const unsubscribe = onSnapshot(
      collection(firestore, newsCollectionName),
      (snapshot) => {
        actions.setLoading(true);
        actions.setNews([
          ...(snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as NewsType[]),
        ]);
        actions.setLoading(false);
      }
    );
    return () => unsubscribe();

    // var changedPlaceIndex: number = state.news.findIndex(
    //   (val) => val.id == docID
    // );

    // switch (type) {
    //   case "added":
    //     if (changedPlaceIndex == -1) {
    //       state.news.push({
    //         id: docID,
    //         title: newsData["title"],
    //         description: newsData["description"],
    //         isActive: newsData["isActive"],
    //         image: newsData["image"],
    //         talukaID: newsData["talukaID"],
    //         imagePath: newsData["imagePath"],
    //         likes: newsData["likes"],
    //         dislikes: newsData["dislikes"],
    //         views: newsData["views"],
    //         shares: newsData["shares"],
    //         timestampCreatedAt: newsData["timestampCreatedAt"],
    //         timestampUpdatedAt: newsData["timestampUpdatedAt"],
    //         likedByUsers: newsData["likedByUsers"],
    //         disLikedByUsers: newsData["disLikedByUsers"],
    //       });
    //     } else if (changedPlaceIndex === 1) {
    //       state.news[changedPlaceIndex] = {
    //         id: docID,
    //         title: newsData["title"],
    //         description: newsData["description"],
    //         isActive: newsData["isActive"],
    //         image: newsData["image"],
    //         talukaID: newsData["talukaID"],
    //         imagePath: newsData["imagePath"],
    //         likes: newsData["likes"],
    //         dislikes: newsData["dislikes"],
    //         views: newsData["views"],
    //         shares: newsData["shares"],
    //         timestampCreatedAt: newsData["timestampCreatedAt"],
    //         timestampUpdatedAt: newsData["timestampUpdatedAt"],
    //         likedByUsers: newsData["likedByUsers"],
    //         disLikedByUsers: newsData["disLikedByUsers"],
    //       };
    //     }
    //     break;
    //   case "modified":
    //     if (changedPlaceIndex !== -1) {
    //       state.news[changedPlaceIndex] = {
    //         id: docID,
    //         title: newsData["title"],
    //         description: newsData["description"],
    //         isActive: newsData["isActive"],
    //         image: newsData["image"],
    //         talukaID: newsData["talukaID"],
    //         imagePath: newsData["imagePath"],
    //         likes: newsData["likes"],
    //         dislikes: newsData["dislikes"],
    //         views: newsData["views"],
    //         shares: newsData["shares"],
    //         timestampCreatedAt: newsData["timestampCreatedAt"],
    //         timestampUpdatedAt: newsData["timestampUpdatedAt"],
    //         likedByUsers: newsData["likedByUsers"],
    //         disLikedByUsers: newsData["disLikedByUsers"],
    //       };
    //     }
    //     break;
    //   case "removed":
    //     if (changedPlaceIndex !== -1) {
    //       state.news.splice(changedPlaceIndex, 1);
    //     }
    //     break;
    // }
  }),
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
};

export { newsModel };
export type { NewsType };
