import { createTypedHooks } from "easy-peasy";
import { AuthModel } from "../store/models/auth/authModel";
import { CategoriesModel } from "../store/models/categoriesModel";
import { ReporterModel } from "../store/models/reporter/reporterModel";
import { HistoricalPlaceModel } from "../store/models/historical-places/historicalPlacesModel";
import { NewsTypeModel } from "../store/models/news/NewsModel";
import { TalukaModel } from "../store/models/taluka/talukaModel";
import { AdminModel } from "../store/models/admin/adminModel";
import { UserModel } from "../store/models/user/userModel";
import { VideoModel } from "../store/models/admin/videos/videosModel";
import { StoreModel } from "../store/models/admin/stores/storeModel";
import { EmergencyContactsModel } from "../store/models/admin/emergencyContacts/emergencyContactsModel";
import { FAQsModel } from "../store/models/admin/emergencyContacts/faqs/faqsModel";

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
  createTypedHooks<{
    auth: AuthModel;
    category: CategoriesModel;
    reporter: ReporterModel;
    historicalPlace: HistoricalPlaceModel;
    news: NewsTypeModel;
    taluka: TalukaModel;
    admin: AdminModel;
    user: UserModel;
    video: VideoModel;
    store: StoreModel;
    emergencyContacts: EmergencyContactsModel;
    faqs: FAQsModel;
  }>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
