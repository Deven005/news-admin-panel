"use client";

import Loading from "@/app/components/Loading";
import TalukaForm from "@/app/components/taluka/TalukaForm";
import { useStoreState } from "@/app/hooks/hooks";
import { usePathname } from "next/navigation";
import React from "react";

const TalukaUpdate = () => {
  const id = usePathname().split("/").pop();
  const { talukas, isLoading } = useStoreState((state) => state.taluka);
  const taluka = talukas.find((t) => t.id === id);
  return isLoading ? <Loading /> : <TalukaForm taluka={taluka} />;
};

export default TalukaUpdate;
