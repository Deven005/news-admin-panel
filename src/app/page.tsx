"use client";
import { useStoreRehydrated } from "easy-peasy";
import MyNavBar from "./components/MyNavBar";
import { auth } from "./firebase/config";
import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { store } from "./store/store";
import { useStoreActions, useStoreState } from "./hooks/hooks";

export default function Home() {
  // const todos = useStoreState((state: State<StoreModel>) => state.todos);
  const isAdmin = useStoreState((state) => state.auth.isAdmin);
  const isAuthenticated = useStoreState((state) => state.auth.isAuthenticated);
  const isReporter = useStoreState((state) => state.auth.isReporter);
  const token = useStoreState((state) => state.auth.token);
  const user = useStoreState((state) => state.auth.user);
  const isRehydrated = useStoreRehydrated();
  const loginSuccess = useStoreActions((state) => state.auth.loginSuccess);
  // const logout = useStoreActions((state) => state.auth.logout);
  // const addTodo = useStoreActions(
  //   (actions: Action<StoreModel>) => actions.addTodo
  // );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    auth.currentUser?.reload().then().catch();
    const unsubscribe = onIdTokenChanged(
      auth,
      async (user) => {
        setIsLoading(true);
        if (user) {
          const { claims, token } = await user.getIdTokenResult();
          loginSuccess({ claims, token, user });
          setIsLoading(false);
        } else {
          // logout(null);
          router.push("/auth/login");
          setIsLoading(false);
        }
      },
      (error) => {
        console.log("app page | onAuthStateChanged catch: ", error);
        setIsLoading(false);
      }
    );
    () => unsubscribe();
  }, []);

  return isRehydrated && !isLoading ? (
    <main className="">
      <MyNavBar />
      <button className="btn btn-outline btn-primary">Primary</button>
      <h1>isAuthenticated: {isAuthenticated}</h1>
      <h1>isAdmin: {isAdmin}</h1>
      <h1>isReporter: {isReporter}</h1>
      <h1>token: {token}</h1>
      <h1>user: {user?.email}</h1>
      <div>
        {/* {todos.map((todo, idx): any => (
          <div key={idx}>{todo}</div>
        ))} */}
        {/* <button
          className="btn btn-outline btn-primary"
          onClick={() => addTodo("5")}
        >
          Primary
        </button> */}
        {/* <AddTodo onAdd={addTodo} /> */}
      </div>
      {/* <h1>{isAuthenticated} isAuthenticated ...</h1> */}
      {/* <p>Auth: {isAuthenticated}</p> */}
      {/* <h1>{isAdmin} isAdmin...</h1> */}
    </main>
  ) : (
    <div>Loading...</div>
  );
}
