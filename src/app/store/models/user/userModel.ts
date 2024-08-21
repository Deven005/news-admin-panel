import { doApiCall, showToast } from "@/app/Utils/Utils";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  profileImage: string;
  creationTime: { _seconds: number; _nanoseconds: number };
  lastSignInTime: { _seconds: number; _nanoseconds: number };
  uid: string;
}

export interface UserModel {
  loading: boolean;
  setLoading: Action<UserModel, boolean>;
  users: User[];
  fetchUsers: Thunk<UserModel>;
}

// Define the model
const userModel: UserModel = {
  loading: false,
  users: [],
  fetchUsers: thunk(async (actions, _, { getState }) => {
    try {
      actions.setLoading(true);
      const response = await (
        await doApiCall({ url: "/admin/user", callType: "g" })
      ).json();
      console.log("users: ", response["users"]);
      if (!("users" in response)) {
        showToast("No users found!", "e");
      }
      const users: User[] = [];
      console.log("creationTime TYPE: ", response["users"][0].creationTime);
      console.log("lastSignInTime TYPE: ", response["users"][0].lastSignInTime);
      response["users"].map((user: User) => users.push(user));
      getState().users = users;
    } catch (error) {
      console.log("fetchUsers catch: ", error);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }),
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
};

export default userModel;