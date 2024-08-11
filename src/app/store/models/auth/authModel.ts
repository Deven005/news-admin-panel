import { auth } from "@/app/firebase/config";
import { action, Action, thunk, Thunk } from "easy-peasy";
import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
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
  isAdmin: boolean;
  isReporter: boolean;
  isAuthenticated: boolean;
  token: string;
  user: User | undefined;
  login: Thunk<AuthModel, LoginInputModel, Promise<void>>;
  loginSuccess: Action<
    AuthModel,
    { claims: Record<string, any>; token: string; user: User }
  >;
  register: Thunk<AuthModel, LoginInputModel, Promise<void>>;
  registerSuccess: Action<
    AuthModel,
    { claims: Record<string, any>; token: string; user: User }
  >;
  setLoading: Action<AuthModel, boolean>;
  setToken: Action<AuthModel, string>;
  setUser: Action<AuthModel, User | undefined>;
  logout: Thunk<AuthModel, null>;
  listenToAuthChanges: Thunk<AuthModel>;
}

const authModel: AuthModel = {
  isLoading: false,
  isAdmin: false,
  isReporter: false,
  isAuthenticated: false,
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
    console.log("claims: ", claims);
    state.user = user;
    state.isAdmin = !!claims.isAdmin;
    state.isReporter = !!claims.isReporter;
    state.isAuthenticated = true;
    state.token = token;
    state.isLoading = false;
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
    state.isReporter = !!claims.reporter;
    state.isAuthenticated = true;
    state.token = token;
  }),
  setToken: action((state, payload) => {
    state.token = payload;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  logout: thunk(async (actions, _, { getState }) => {
    try {
      actions.setLoading(true);

      await auth.signOut();
      await store.persist.flush();
      await store.persist.clear();
      actions.setUser(undefined);
      actions.setToken("");
      getState().isAuthenticated = false;
      getState().isAdmin = false;
      getState().isReporter = false;
    } catch (error) {
      console.error("Logout Action Error: ", error);
    } finally {
      actions.setLoading(false);
    }
  }),
  listenToAuthChanges: thunk((actions) => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      try {
        if (user) {
          const { claims, token } = await user.getIdTokenResult();
          actions.loginSuccess({ claims, token, user });
        } else {
          actions.logout(null);
        }
      } catch (error) {
        console.log("listenToAuthChanges err: ", error);
      } finally {
        actions.setLoading(false);
      }
    });
    return () => unsubscribe();
  }),
};

export { authModel };
