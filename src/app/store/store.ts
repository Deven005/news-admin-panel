import { createStore, persist } from "easy-peasy";
import { authModel } from "./models/auth/authModel";
import { categoryModel } from "./models/categoriesModel";
import { reporterModel } from "./models/reporter/reporterModel";
import { historicalPlaceModel } from "./models/historical-places/historicalPlacesModel";
import { newsModel } from "./models/news/NewsModel";
import { talukaModel } from "./models/taluka/talukaModel";
import { adminModel } from "./models/admin/adminModel";
import userModel from "./models/user/userModel";
import { videoModel } from "./models/admin/videos/videosModel";
import { storeModel } from "./models/admin/stores/storeModel";
import { emergencyContactsModel } from "./models/admin/emergencyContacts/emergencyContactsModel";
import { faqsModel } from "./models/admin/emergencyContacts/faqs/faqsModel";

// export interface StoreModel {
//   todos: string[];
//   addTodo: Action<StoreModel, any>;
// }

export const store = createStore(
  persist(
    {
      auth: authModel,
      category: categoryModel,
      reporter: reporterModel,
      historicalPlace: historicalPlaceModel,
      news: newsModel,
      taluka: talukaModel,
      admin: adminModel,
      user: userModel,
      video: videoModel,
      store: storeModel,
      emergencyContacts: emergencyContactsModel,
      faqs: faqsModel,
      // todos: ["Create store", "Wrap application", "Use store"],
      // addTodo: action((state, payload) => {
      //   state.todos.push(payload);
      // }),
    },
    { storage: "localStorage" }
  )
);
