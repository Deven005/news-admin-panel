"use client";
import Loading from "@/app/components/Loading";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useStoreState } from "@/app/hooks/hooks";
import Image from "next/image";
import NewsDetails from "@/app/components/news/NewsDetails";

const EditNewsView = () => {
  return <NewsDetails />;
};

export default EditNewsView;
