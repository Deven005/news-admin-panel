import { auth } from "@/app/firebase/config";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { action, Action, thunk, Thunk } from "easy-peasy";

interface Admin {
  id: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userUid: string;
  userEmailVerified: boolean;
  userCreationTime: string;
  userLastRefreshTime: string;
  userLastSignInTime: string;
}

interface AddAdminType {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

interface UpdateAdminType {
  userFirstName?: string;
  userLastName?: string;
  userUid: string;
  lastSignInTime?: string | undefined;
}

export interface AdminModel {
  admins: Admin[];
  getAdmins: Thunk<AdminModel>;
  addAdmin: Thunk<AdminModel, AddAdminType>;
  updateAdmin: Thunk<AdminModel, UpdateAdminType>;
  deleteAdmin: Thunk<AdminModel, string>;
  loading: boolean;
  setLoading: Action<AdminModel, boolean>;
}

const adminModel: AdminModel = {
  admins: [],
  getAdmins: thunk(async (actions, _, { getState }) => {
    try {
      actions.setLoading(true);
      const response = await doApiCall({
        url: "/admin/admin",
        callType: "g",
      });
      if (!response.ok) {
        throw await response.json();
      }
      const resJson = await response.json();
      if ("admins" in resJson) {
        getState().admins = [
          ...resJson["admins"].map(
            (admin: any) =>
              ({
                id: admin.id,
                userFirstName: admin.userFirstName,
                userLastName: admin.userLastName,
                userEmail: admin.userEmail,
                userEmailVerified: admin.userEmailVerified || false,
                userCreationTime: admin.userCreationTime,
                userLastRefreshTime: admin.userLastRefreshTime || "",
                userLastSignInTime: admin.userLastSignInTime || "",
                userUid: admin.userUid,
              } as Admin)
          ),
        ];
      } else {
        getState().admins = [];
      }
    } catch (error) {
      console.log("getAdmins: err: ", error);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  addAdmin: thunk(async (actions, payload) => {
    // state.admins.push(payload);
    try {
      const { userEmail, userFirstName, userLastName } = payload;
      actions.setLoading(true);

      const addAdminFormData = new FormData();
      addAdminFormData.append("userFirstName", userFirstName);
      addAdminFormData.append("userLastName", userLastName);
      addAdminFormData.append("userEmail", userEmail);

      const response = await doApiCall({
        url: "/admin/admin",
        callType: "",
        formData: addAdminFormData,
      });
      if (!response.ok) {
        throw await response.json();
      }
      showToast("Admin added successfully!", "s");
    } catch (error) {
      console.log("add admin err: ", error);
      showToast("Admin not added successfully!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  updateAdmin: thunk(async (actions, payload, { getState }) => {
    // state.admins.push(payload);
    try {
      const { userFirstName, userLastName, userUid, lastSignInTime } = payload;
      actions.setLoading(true);

      if (getState().admins.length == 0) {
        await actions.getAdmins();
      }

      const currentAdmin = getState().admins.filter(
        (admin) => admin.userUid == userUid
      )[0];

      const updateAdminFormData = new FormData();

      if (auth.currentUser?.emailVerified != currentAdmin.userEmailVerified) {
        updateAdminFormData.append(
          "userEmailVerified",
          (auth.currentUser?.emailVerified ?? false).toString()
        );
        currentAdmin.userEmailVerified =
          auth.currentUser?.emailVerified ?? false;
      }

      if (userFirstName) {
        updateAdminFormData.append("userFirstName", userFirstName);
        currentAdmin.userFirstName = userFirstName;
      }

      if (userLastName) {
        updateAdminFormData.append("userLastName", userLastName);
        currentAdmin.userLastName = userLastName;
      }

      if (lastSignInTime)
        updateAdminFormData.append("lastSignInTime", lastSignInTime);

      const response = await doApiCall({
        url: `/admin/admin/${currentAdmin.id}`,
        callType: "p",
        formData: updateAdminFormData,
      });
      if (!response.ok) {
        throw await response.json();
      }
      getState().admins = getState().admins.map((admin) =>
        admin.id === currentAdmin.id ? { ...admin, ...currentAdmin } : admin
      );
      showToast("Admin updated successfully!", "s");
    } catch (error) {
      console.log("update admin err: ", error);
      showToast("Admin not updated successfully!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  deleteAdmin: thunk(async (actions, id, { getState }) => {
    // state.admins.push(payload);
    try {
      actions.setLoading(true);

      const currentAdmin = getState().admins.filter(
        (admin) => admin.id == id
      )[0];

      const response = await doApiCall({
        url: `/admin/admin/${id}?uid=${currentAdmin.userUid}`,
        callType: "d",
        formData: new FormData(),
      });
      if (!response.ok) {
        throw await response.json();
      }
      getState().admins = getState().admins.filter((admin) => admin.id !== id);
      showToast("Admin deleted successfully!", "s");
    } catch (error) {
      console.log("add admin err: ", error);
      showToast("Admin not deleted successfully!", "e");
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
};

export { adminModel };
export type { Admin, AddAdminType, UpdateAdminType };
