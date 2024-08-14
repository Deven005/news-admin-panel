"use client";
import { useStoreRehydrated } from "easy-peasy";
import { useEffect } from "react";
import { useStoreActions, useStoreState } from "./hooks/hooks";
import AdminDashboard from "./components/admin/AdminDashboard";
import ReporterDashboard from "./components/reporter/ReporterDashboard";
import Loading from "./components/Loading";
import { auth } from "./firebase/config";

export default function Home() {
  const isRehydrated = useStoreRehydrated();

  const { isAdmin, isLoading, isReporter } = useStoreState(
    (state) => state.auth
  );
  // const { listenToAuthChanges, setLoading } = useStoreActions(
  //   (state) => state.auth
  // );

  useEffect(() => {
    auth.currentUser?.reload();
  }, []);

  return isRehydrated && !isLoading ? (
    <main className="">
      {isAdmin ? (
        <AdminDashboard />
      ) : isReporter ? (
        <ReporterDashboard />
      ) : (
        <p>Nothing to show!</p>
      )}
    </main>
  ) : (
    <Loading />
  );
}
