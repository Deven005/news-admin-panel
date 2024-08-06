import { auth } from "@/app/firebase/config";
import { action, Action, thunk, Thunk } from "easy-peasy";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { store } from "../../store";

interface LoginInputModel {
  email: string;
  password: string;
}

export interface AuthModel {
  isLoading: boolean;
  isAdmin: string;
  isReporter: string;
  isAuthenticated: string;
  token: string;
  user: User | undefined;
  login: Thunk<AuthModel, LoginInputModel, Promise<void>>;
  loginSuccess: Action<AuthModel, any>;
  register: Thunk<AuthModel, LoginInputModel, Promise<void>>;
  registerSuccess: Action<AuthModel, any>;
  setLoading: Action<AuthModel, boolean>;
  setToken: Action<AuthModel, string>;
  setUser: Action<AuthModel, User | undefined>;
  logout: Thunk<AuthModel, null>;
}

const authModel: AuthModel = {
  isLoading: false,
  isAdmin: "false",
  isReporter: "false",
  isAuthenticated: "false",
  user: undefined,
  token: "",
  setLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  login: thunk(async (actions, payload) => {
    try {
      const { email, password } = payload;
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const { claims, token } = await user.getIdTokenResult();
      actions.loginSuccess({ claims, token, user });
    } catch (error) {
      console.log("error login auth store: ", error);
      throw error;
    }
  }),
  loginSuccess: action((state, payload) => {
    const { claims, token, user } = payload;
    state.user = user;
    state.isAdmin = "isAdmin" in claims ? "true" : "false" || "false";
    state.isReporter = "isReporter" in claims ? "true" : "false" || "false";
    state.isAuthenticated = "true";
    state.token = token;

    console.log("claims: ", claims);
  }),
  register: thunk(async (actions, payload) => {
    try {
      const { email, password } = payload;
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { claims, token } = await user.getIdTokenResult();
      actions.registerSuccess({ claims, token, user });
    } catch (error) {
      console.log("error register auth store: ", error);
      throw error;
    }
  }),
  registerSuccess: action((state, payload) => {
    const { claims, token, user } = payload;
    state.user = user;
    state.isReporter = "isReporter" in claims ? "true" : "false" || "false";
    state.isAuthenticated = "true";
    state.token = token;
    console.log("claims: ", claims);
  }),
  setToken: action((state, payload) => {
    state.token = payload;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  logout: thunk(async (actions, payload, { getState }) => {
    try {
      getState().isLoading = true;
      await auth.signOut();
      store.persist.clear().then().catch();
      getState().isLoading = false;
      console.log("Logout logout ");
    } catch (error) {
      console.log("Logout ACtion Error: ", error);
      getState().isLoading = false;
    }
  }),
};

export { authModel };
