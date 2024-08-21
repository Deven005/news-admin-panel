import { firestore } from "@/app/firebase/config";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { showToast, storesCollectionName } from "@/app/Utils/Utils";

interface Store {
  storeID: string;
  storeName: string;
  storeDescription: string;
  storeEmail: string;
  storeContact: string;
  storeAddress: string;
  storeCategoryID: string;
  storeClosingDay: string;
  storeCreatedAt: Timestamp;
  storeUpdatedAt: Timestamp;
  storeImages: string[];
  storeIsHomeDeliveryEnable: boolean;
  storeLatitude: number;
  storeLongitude: number;
  storeTiming: {
    openAt: string;
    closeAt: string;
  };
  storeType: string;
  storeUpiList: {
    provider: string;
    upiId: string;
  }[];
  storeWhatsappContact: string;
  storeOwner: string;
  isActive: boolean;
}

interface UpdateStorePayload {
  storeID: string;
  isActive: boolean;
}

interface StoreModel {
  stores: Store[];
  listenStoreChange: Thunk<StoreModel>;
  deleteStore: Thunk<StoreModel, string>;
  updateStore: Thunk<StoreModel, UpdateStorePayload>;
  isLoading: boolean;
  setLoading: Action<StoreModel, boolean>;
}

const storeModel: StoreModel = {
  stores: [],
  deleteStore: thunk(async (actions, id) => {
    try {
      actions.setLoading(true);
      await deleteDoc(doc(firestore, `${storesCollectionName}/${id}`));
      showToast("Store is deleted!", "s");
    } catch (error) {
      console.error("Error deleting store:", error);
      showToast("Error deleting store!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  updateStore: thunk(async (actions, payload) => {
    try {
      const { storeID, isActive } = payload;
      actions.setLoading(true);
      await updateDoc(doc(firestore, `${storesCollectionName}/${storeID}`), {
        isActive,
      });
      showToast("Store is updated!", "s");
    } catch (error) {
      console.error("Error updating store:", error);
      showToast("Error updating store!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  listenStoreChange: thunk(async (actions, _, { getState }) => {
    try {
      actions.setLoading(true);
      const unsubscribe = onSnapshot(
        collection(firestore, storesCollectionName),
        (snapshot) => {
          getState().stores = [
            ...(snapshot.docs.map((doc) => ({
              storeID: doc.id,
              ...doc.data(),
            })) as Store[]),
          ];
          actions.setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  }),
  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
};

export { storeModel };
export type { Store, StoreModel };
