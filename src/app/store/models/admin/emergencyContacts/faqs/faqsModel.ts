import { auth, firestore } from "@/app/firebase/config";
import { showToast } from "@/app/Utils/Utils";
import { action, thunk, Thunk, Action } from "easy-peasy";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

interface FAQsModel {
  faqs: FAQ[];
  addFAQ: Thunk<FAQsModel, AddFAQType>;
  updateFAQ: Thunk<FAQsModel, UpdateFAQType>;
  deleteFAQ: Thunk<FAQsModel, string>;
  listenFAQs: Thunk<FAQsModel>;
  loading: boolean;
  setLoading: Action<FAQsModel, boolean>;
}

const faqsModel: FAQsModel = {
  loading: false,
  faqs: [],
  addFAQ: thunk(async (actions, newFAQ) => {
    actions.setLoading(true);
    try {
      if (!auth.currentUser) {
        throw new Error("No user found in addFAQ!");
      }
      await addDoc(collection(firestore, "FAQs"), {
        ...newFAQ,
        addedBy: auth.currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      showToast("FAQ added!", "s");
    } catch (error) {
      console.error("Error adding FAQ:", error);
      showToast("Error adding FAQ!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  updateFAQ: thunk(async (actions, payload, { getState }) => {
    const { id, title, description, isActive } = payload;
    try {
      actions.setLoading(true);
      const dataToUpdate: any = { updatedAt: Timestamp.now() };

      const currentFaq = getState().faqs.find((faq) => faq.id == id)!;

      if (title) dataToUpdate["title"] = title;
      if (description) dataToUpdate["description"] = description;
      dataToUpdate["isActive"] = isActive ?? currentFaq.isActive;

      await updateDoc(doc(firestore, "FAQs", id), dataToUpdate);
      showToast("FAQ updated!", "s");
    } catch (error) {
      console.log("FAQ delete err: ", error);
      showToast("Error updating FAQ!", "e");
    } finally {
      actions.setLoading(false);
    }
  }),
  deleteFAQ: thunk(async (actions, id) => {
    try {
      actions.setLoading(true);
      await deleteDoc(doc(firestore, "FAQs", id));
      showToast("Faq is deleted!", "s");
    } catch (error) {
      console.log("FAQ delete err: ", error);
      showToast("Error for Faq is deletion!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  listenFAQs: thunk(async (actions, _, { getState }) => {
    getState().loading = true;
    const unsubscribe = onSnapshot(
      collection(firestore, "FAQs"),
      (snapshot) => {
        getState().faqs = [
          ...(snapshot.docs.map((doc) => ({
            id: doc.id,
            isActive: doc.data()["isActive"] ?? false,
            ...doc.data(),
          })) as FAQ[]),
        ];
      }
    );
    getState().loading = false;

    return () => unsubscribe();
  }),
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
};

export { faqsModel };
export type { FAQsModel, FAQ };

interface UpdateFAQType {
  id: string;
  title?: string;
  description?: string;
  isActive?: boolean;
}

interface AddFAQType {
  title: string;
  description: string;
}

interface FAQ {
  id: string;
  addedBy: string;
  description: string;
  title: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
