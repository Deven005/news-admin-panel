"use client";
import AdminForm from "@/app/components/admin/AdminForm";
import Loading from "@/app/components/Loading";
import { useStoreState } from "@/app/hooks/hooks";
import { usePathname } from "next/navigation";
import React from "react";

const UpdateAdmin = () => {
  const id = usePathname().split("/").pop();
  const admins = useStoreState((state) => state.admin.admins);
  const admin = admins.find((t) => t.id === id);
  return <AdminForm initialData={admin} />;
};

export default UpdateAdmin;
