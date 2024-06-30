import { createStore, persist } from "easy-peasy";
import { authModel } from "./models/auth/authModel";
import { categoryModel } from "./models/categoriesModel";
import { reporterModel } from "./models/reporter/reporterModel";
import { historicalPlaceModel } from "./models/historical-places/historicalPlacesModel";

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
      // todos: ["Create store", "Wrap application", "Use store"],
      // addTodo: action((state, payload) => {
      //   state.todos.push(payload);
      // }),
    },
    { storage: "localStorage" }
  )
);
