import { createTypedHooks } from "easy-peasy";
import { AuthModel } from "../store/models/auth/authModel";
import { CategoriesModel } from "../store/models/categoriesModel";
import { ReporterModel } from "../store/models/reporter/reporterModel";
import { HistoricalPlaceModel } from "../store/models/historical-places/historicalPlacesModel";

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
  createTypedHooks<{
    auth: AuthModel;
    category: CategoriesModel;
    reporter: ReporterModel;
    historicalPlace: HistoricalPlaceModel;
  }>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
