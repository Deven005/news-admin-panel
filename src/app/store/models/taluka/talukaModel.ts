import { firestore } from "@/app/firebase/config";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { action, Action, thunk, Thunk } from "easy-peasy";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

export interface Taluka {
  id: string;
  talukaName: string;
  talukaIconImage: string;
  talukaImageFilePath: string;
  isActive: boolean;
  talukaCreatedAt: Date;
  talukaUpdatedAt: Date;
  talukaClickCount: number;
}

export interface TalukaModel {
  isLoading: boolean;
  setLoading: Action<TalukaModel, boolean>;
  talukas: Taluka[];
  fetchTalukas: Thunk<TalukaModel>;
  addOrUpdateTaluka: Thunk<
    TalukaModel,
    Partial<Taluka> & { image?: File | null }
  >;
  setTalukas: Action<TalukaModel, Taluka[]>;
  deleteTaluka: Thunk<TalukaModel, string>;
}
const talukaModel: TalukaModel = {
  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  talukas: [],
  setTalukas: action((state, payload) => {
    state.talukas = payload;
  }),
  fetchTalukas: thunk(async (actions) => {
    try {
      actions.setLoading(true);
      const unsubscribe = onSnapshot(
        collection(firestore, "talukaList"),
        (snapshot) => {
          actions.setLoading(true);
          const talukas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            talukaCreatedAt: (doc.data().talukaCreatedAt as Timestamp).toDate(),
            talukaUpdatedAt: (doc.data().talukaUpdatedAt as Timestamp).toDate(),
          })) as Taluka[];
          actions.setLoading(false);
          actions.setTalukas(talukas);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching Talukas:", error);
    }
  }),
  addOrUpdateTaluka: thunk(
    async (actions, { id, talukaName, isActive, image }) => {
      try {
        const formData = new FormData();
        if (image) formData.append("iconImage", image);
        var url: string = "/admin/taluka",
          callType = "";

        console.log("addOrUpdateTaluka talukaName: ", talukaName);

        formData.append("talukaName", talukaName ?? "");
        formData.append("isActive", String(isActive ?? false));

        const response = await doApiCall({
          url: id ? `${url}/${id}` : url,
          formData: formData,
          callType: id ? "p" : callType,
        });
        console.log("adding/updating res: ", response);
        if (response.ok) {
          showToast(`${id ? "Updated" : "Added"}!`, "s");
        } else {
          throw Error("");
        }
      } catch (error) {
        console.error("Error adding/updating Taluka:", error);
        showToast(`Not ${id ? "Updated" : "Added"}!`, "s");
      }
    }
  ),
  deleteTaluka: thunk(async (actions, id) => {
    try {
      actions.setLoading(true);
      const response = await doApiCall({
        url: `/admin/taluka/${id}`,
        callType: "d",
        formData: new FormData(),
      });
      console.log("delete taluka res: ", response);
      actions.setLoading(false);
      if (response.ok) {
        showToast("Deleted!", "s");
      } else {
        throw Error("");
      }
    } catch (error) {
      showToast("Not Deleted!", "e");
      throw error;
    }
  }),
  // updateTaluka: thunk(async (actions, { id, data, file }, helper) => {
  //   const formData = new FormData();
  //   if (file) formData.append("iconImage", file);

  //   const response = await doApiCall({
  //     url: `/admin/taluka/${id}`,
  //     callType: "p",
  //     formData: formData,
  //   });

  //   console.log("updateTaluka res: ", response);

  //   if (!response.ok) {
  //   }
  // }),
};

export { talukaModel };
