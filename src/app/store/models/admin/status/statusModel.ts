"use client";
import { firestore } from "@/app/firebase/config";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { action, Action, thunk, Thunk } from "easy-peasy";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Interface for a Status
export interface Status {
  statusID: string;
  statusCatID: string;
  statusCreatedAt: Timestamp;
  statusUpdatedAt: Timestamp;
  statusImgs: { downloadUrl: string; filePath: string }[];
  statusPostedBy: string;
  seenBy: { [key: string]: number };
  isActive: boolean; // Add isActive field
}

// Interface for a Status Category
export interface StatusCategory {
  statusCatId: string;
  isActive: boolean;
  statusCatCreatedAt: Timestamp;
  statusCatImg: {
    downloadUrl: string;
    filePath: string;
  };
  statusCatName: string;
  statusCatUpdatedAt: Timestamp;
}

export interface StatusModel {
  loading: boolean;
  statusCategories: StatusCategory[];
  statuses: Status[];
  setStatusCategories: Action<StatusModel, StatusCategory[]>;
  setStatuses: Action<StatusModel, Status[]>;
  listenStatusCategories: Thunk<StatusModel>;
  listenStatuses: Thunk<StatusModel>;
  updateStatusActive: Thunk<
    StatusModel,
    { statusID: string; isActive: boolean }
  >;
  addStatusCategory: Thunk<StatusModel, Partial<StatusCategory>>;
  updateStatusCategory: Thunk<StatusModel, Partial<StatusCategory>>;
  deleteStatusCategory: Thunk<StatusModel, string>;
  addStatus: Thunk<StatusModel, AddStatusFormData>;
  setLoading: Action<StatusModel, boolean>;
}

const statusModel: StatusModel = {
  loading: false,
  statusCategories: [],
  statuses: [],

  addStatus: thunk(async (actions, payload) => {
    try {
      const { category, images } = payload;
      const formData = new FormData();
      formData.append("statusCatID", category);

      Array.from(images).forEach((image) => {
        formData.append("statusFiles", image);
      });

      const response = await doApiCall({
        url: "/reporter/statuses",
        callType: "",
        formData,
      });
      if (!response.ok) {
        throw new Error(await response.json());
      }

      showToast("Status added successfully!", "s");
    } catch (error: any) {
      showToast(error["message"] ?? "Failed to add status!", "e");
    }
  }),

  listenStatusCategories: thunk((actions) => {
    const unsubscribe = onSnapshot(
      collection(firestore, "statusCategories"),
      (snapshot) => {
        actions.setStatusCategories([
          ...snapshot.docs.map((doc) => {
            return {
              statusCatId: doc.id,
              ...doc.data(),
            } as StatusCategory;
          }),
        ]);
      }
    );

    return () => unsubscribe();
  }),

  listenStatuses: thunk((actions) => {
    const unsubscribe = onSnapshot(
      collection(firestore, "statuses"),
      (snapshot) => {
        actions.setStatuses([
          ...snapshot.docs.map((doc) => {
            return {
              statusID: doc.id,
              isActive: doc.data()["isActive"] ?? false,
              ...doc.data(),
            } as Status;
          }),
        ]);
      },
      (error) => {
        console.error("Error fetching statuses: ", error);
      }
    );

    return () => unsubscribe();
  }),

  updateStatusActive: thunk(async (actions, payload, { getState }) => {
    try {
      const { statusID, isActive } = payload;

      actions.setLoading(true);
      // Update status in Firestore
      await updateDoc(doc(firestore, "statuses", statusID), {
        isActive: isActive ?? false,
      });

      // Update local state to reflect the change immediately
      const updatedStatuses = getState().statuses.map((status) =>
        status.statusID === statusID ? { ...status, isActive } : status
      );
      actions.setStatuses(updatedStatuses);
    } catch (error) {
      console.error("Error updating status active state: ", error);
    } finally {
      actions.setLoading(false);
    }
  }),

  addStatusCategory: thunk(async (actions, newCategory, { getState }) => {
    try {
      actions.setLoading(true);
      // Add new category to Firestore
      await addDoc(collection(firestore, "statusCategories"), {
        ...newCategory,
        statusCatCreatedAt: Timestamp.now(),
        statusCatUpdatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding status category: ", error);
    } finally {
      actions.setLoading(false);
    }
  }),

  updateStatusCategory: thunk(
    async (actions, updatedCategory, { getState }) => {
      try {
        actions.setLoading(true);
        const { statusCatId, ...updateData } = updatedCategory;

        // Update category in Firestore
        await updateDoc(doc(firestore, "statusCategories", statusCatId!), {
          ...updateData,
          statusCatUpdatedAt: Timestamp.now(),
        });

        // Update local state to reflect the change immediately
        const updatedCategories = getState().statusCategories.map((category) =>
          category.statusCatId === statusCatId
            ? {
                ...category,
                ...updateData,
                statusCatUpdatedAt: Timestamp.now(),
              }
            : category
        );
        actions.setStatusCategories(updatedCategories);
      } catch (error) {
        console.error("Error updating status category: ", error);
      } finally {
        actions.setLoading(false);
      }
    }
  ),

  deleteStatusCategory: thunk(async (actions, statusCatId, { getState }) => {
    try {
      actions.setLoading(true);
      // Delete category from Firestore
      await deleteDoc(doc(firestore, "statusCategories", statusCatId));

      // Update local state to remove the deleted category
      const updatedCategories = getState().statusCategories.filter(
        (category) => category.statusCatId !== statusCatId
      );
      actions.setStatusCategories(updatedCategories);
      showToast("Status is deleted!", "s");
    } catch (error) {
      console.error("Error deleting status category: ", error);
      showToast("Error deleting status category!", "s");
    } finally {
      actions.setLoading(false);
    }
  }),

  setStatusCategories: action((state, payload) => {
    state.statusCategories = payload;
  }),

  setStatuses: action((state, payload) => {
    state.statuses = payload;
  }),

  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
};

export interface AddStatusFormData {
  category: string;
  images: FileList;
}

export default statusModel;
