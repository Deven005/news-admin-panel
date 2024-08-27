"use client";
import Loading from "@/app/components/Loading";
import NewsForm from "@/app/components/news/NewsForm";
import { useStoreState } from "@/app/hooks/hooks";
import { usePathname } from "next/navigation";
import React from "react";

const ReporterUpdateNews = () => {
  const usePath = usePathname();
  const { news } = useStoreState((states) => states.news);
  const currentNews = news.find((news) => news.id === usePath.split("/").pop());

  return currentNews == undefined ? (
    <Loading />
  ) : (
    <NewsForm news={currentNews} />
  );
};

export default ReporterUpdateNews;
