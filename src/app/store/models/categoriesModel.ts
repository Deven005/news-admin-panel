import { action, Action, thunk, Thunk } from "easy-peasy";
import firebase from "firebase/compat/app";
import { DocumentData } from "firebase/firestore";

interface Category {
  categoryID: string;
  categoryName: string;
  categoryType: string;
  categoryIconImage: string;
  categoryFilePath: string;
  categoryCreatedAt: firebase.firestore.Timestamp;
  categoryUpdatedAt: firebase.firestore.Timestamp;
}

interface UpdateCategory {
  changedCatIndex: number;
  catData: DocumentData;
}

interface CategoryCountsType {
  business: number;
  service: number;
}

interface CategoriesModel {
  typesList: string[];
  selectedType: string;
  categories: Category[];
  categoryCounts: CategoryCountsType;
  categoriesFilter: Category[];

  addCategory: Thunk<CategoriesModel, Category>;
  updateCategory: Thunk<CategoriesModel, UpdateCategory>;
  deleteCategory: Thunk<CategoriesModel, number>;
  categoriesFilterAction: Action<CategoriesModel, undefined>;
  changeSelectedTypeAction: Action<CategoriesModel, string>;
}

const categoryModel: CategoriesModel = {
  typesList: ["Business", "Services"],
  selectedType: "Business",
  categories: [],
  categoryCounts: { business: 0, service: 0 },
  categoriesFilter: [],
  addCategory: thunk((actions, payload, state) => {
    state.getState().categories.push(payload);
    actions.categoriesFilterAction(undefined);
  }),
  deleteCategory: thunk((actions, payload, state) => {
    state.getState().categories.splice(payload, 1);
    actions.categoriesFilterAction(undefined);
  }),
  updateCategory: thunk((actions, payload, state) => {
    const { changedCatIndex, catData } = payload;
    var updateCat = state.getState().categories[changedCatIndex];
    updateCat.categoryIconImage = catData["categoryIconImage"];
    updateCat.categoryFilePath = catData["categoryFilePath"];
    updateCat.categoryName = catData["categoryName"];
    updateCat.categoryUpdatedAt = catData["categoryUpdatedAt"];
    state.getState().categories[changedCatIndex] = updateCat;
    actions.categoriesFilterAction(undefined);
  }),
  changeSelectedTypeAction: action((state, payload) => {
    state.selectedType = payload.toLowerCase();
    state.categoriesFilter = state.categories.filter(
      (val) => val.categoryType.toLowerCase() == payload.toLowerCase()
    );
  }),
  categoriesFilterAction: action((state, payload) => {
    state.categoriesFilter = state.categories.filter(
      (val) =>
        val.categoryType.toLowerCase() == state.selectedType.toLowerCase()
    );
    state.categoryCounts = state.categories.reduce(
      (acc, category) => {
        if (category.categoryType === "business") {
          acc.business++;
        } else if (category.categoryType === "service") {
          acc.service++;
        }
        return acc;
      },
      { business: 0, service: 0 }
    );
  }),
};

export { categoryModel };
export type { Category, CategoriesModel };
