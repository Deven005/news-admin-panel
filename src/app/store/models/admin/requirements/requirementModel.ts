import { firestore } from "@/app/firebase/config";
import { showToast } from "@/app/Utils/Utils";
import { action, Action, thunk, Thunk } from "easy-peasy";
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Define interfaces for Requirement Categories
export interface RequirementCategory {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  image: string;
  name: string;
}

// Define interfaces for Post Requirements
export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Media {
  mediaType: string;
  mediaUrl: string;
}

export interface Comment {
  commentId: string;
  commentMessage: string;
  commentUpdatedTime: Timestamp;
  commentedBy: string;
  commentedTime: Timestamp;
  isVisible: boolean;
  likes: number;
  replies?: string[];
}

export interface PostRequirement {
  postReqID: string;
  contactOrWhatsappNumber: string;
  description: string;
  location: Location;
  postReqCreatedAt: Timestamp;
  postReqUpdatedAt: Timestamp;
  postReqMediaType: string;
  postReqMedias: Media[];
  postedReqBy: string;
  requirementCatID: string;
  type: string;
  comments: Comment[];
}

// Define the combined RequirementsModel interface
export interface RequirementsModel {
  loading: boolean;
  // Categories related state and actions
  requirementCategories: RequirementCategory[];
  listenRequirementCategories: Thunk<RequirementsModel>;
  addRequirementCategory: Thunk<
    RequirementsModel,
    Partial<RequirementCategory>
  >;
  updateRequirementCategory: Thunk<
    RequirementsModel,
    Partial<RequirementCategory>
  >;
  deleteRequirementCategory: Thunk<RequirementsModel, string>;
  updateRequirementCategoryActive: Thunk<
    RequirementsModel,
    { id: string; isActive: boolean }
  >;

  // Post requirements related state and actions
  postRequirements: PostRequirement[];
  setPostRequirements: Action<RequirementsModel, PostRequirement[]>;
  listenPostRequirements: Thunk<RequirementsModel>;
  deletePostRequirement: Thunk<RequirementsModel, string>;
  updatePostRequirementsActive: Thunk<
    RequirementsModel,
    { postReqID: string; isActive: boolean }
  >;
  setPostRequirementsCats: Action<RequirementsModel, RequirementCategory[]>;
}

// Define the combined requirementsModel
const requirementsModel: RequirementsModel = {
  loading: false,
  requirementCategories: [],
  postRequirements: [],

  listenRequirementCategories: thunk((actions, _, { getState }) => {
    const unsubscribe = onSnapshot(
      collection(firestore, "requirementCategories"),
      (snapshot) => {
        getState().requirementCategories = [
          ...snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as RequirementCategory;
          }),
        ];
      }
    );

    return () => unsubscribe();
  }),

  listenPostRequirements: thunk((actions, _, { getState }) => {
    const unsubscribe = onSnapshot(
      collection(firestore, "postRequirements"),
      (snapshot) => {
        actions.setPostRequirements([
          ...snapshot.docs.map((doc) => {
            return {
              postReqID: doc.id,
              ...doc.data(),
            } as PostRequirement;
          }),
        ]);
      }
    );

    return () => unsubscribe();
  }),

  deletePostRequirement: thunk(async (actions, postReqID, { getState }) => {
    try {
      getState().loading = true;
      await deleteDoc(doc(firestore, "postRequirements", postReqID));
      actions.setPostRequirements(
        getState().postRequirements.filter(
          (post) => post.postReqID !== postReqID
        )
      );
      showToast("Requirement is deleted!", "s");
    } catch (error) {
      console.error("Error deleting post requirement:", error);
      showToast("Error for deleting requirement!", "e");
    } finally {
      getState().loading = false;
    }
  }),

  addRequirementCategory: thunk(async (actions, newCategory, { getState }) => {
    try {
      getState().loading = true;
      await addDoc(collection(firestore, "requirementCategories"), {
        ...newCategory,      
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      showToast("Category added successfully!", "s");
    } catch (error) {
      console.error("Error adding requirement category:", error);
      showToast("Error adding category!", "e");
    } finally {
      getState().loading = false;
    }
  }),

  updateRequirementCategory: thunk(
    async (actions, updatedCategory, { getState }) => {
      try {
        getState().loading = true;
        const { id, ...data } = updatedCategory;
        const updatedData = { ...data };
        updatedData["updatedAt"] = Timestamp.now();

        await updateDoc(
          doc(firestore, "requirementCategories", id!),
          updatedData
        );

        const updatedCategories = getState().requirementCategories.map(
          (category) =>
            category.id === id ? { ...category, ...data } : category
        );
        actions.setPostRequirementsCats(updatedCategories);
        showToast("Category updated successfully!", "s");
      } catch (error) {
        console.error("Error updating requirement category:", error);
        showToast("Error updating category!", "e");
      } finally {
        getState().loading = false;
      }
    }
  ),

  deleteRequirementCategory: thunk(
    async (actions, categoryId, { getState }) => {
      try {
        getState().loading = true;
        await deleteDoc(doc(firestore, "requirementCategories", categoryId));

        const filteredCategories = getState().requirementCategories.filter(
          (category) => category.id !== categoryId
        );
        actions.setPostRequirementsCats(filteredCategories);
        showToast("Category deleted successfully!", "s");
      } catch (error) {
        console.error("Error deleting requirement category:", error);
        showToast("Error deleting category!", "e");
      } finally {
        getState().loading = false;
      }
    }
  ),

  setPostRequirements: action((state, postRequirements) => {
    state.postRequirements = postRequirements;
  }),

  setPostRequirementsCats: action((state, requirementCategories) => {
    state.requirementCategories = requirementCategories;
  }),

  updatePostRequirementsActive: thunk(
    async (actions, payload, { getState }) => {
      try {
        const { postReqID, isActive } = payload;

        getState().loading = true;
        await updateDoc(doc(firestore, "postRequirements", postReqID), {
          isActive: isActive ?? false,
        });

        const updatedPostRequirements = getState().postRequirements.map(
          (post) =>
            post.postReqID === postReqID ? { ...post, isActive } : post
        );
        actions.setPostRequirements(updatedPostRequirements);
      } catch (error) {
        console.error("Error updating status active state: ", error);
      } finally {
        getState().loading = false;
      }
    }
  ),

  updateRequirementCategoryActive: thunk(
    async (actions, payload, { getState }) => {
      try {
        const { id, isActive } = payload;

        getState().loading = true;
        await updateDoc(doc(firestore, "requirementCategories", id), {
          isActive: isActive ?? false,
        });

        const updatedPostCats = getState().requirementCategories.map(
          (postCat) => (postCat.id === id ? { ...postCat, isActive } : postCat)
        );
        actions.setPostRequirementsCats(updatedPostCats);
      } catch (error) {
        console.error("Error updating status active state: ", error);
      } finally {
        getState().loading = false;
      }
    }
  ),
};

export { requirementsModel };
