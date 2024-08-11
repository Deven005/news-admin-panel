"use client";
import NewsForm from "@/app/components/news/NewsForm";
import { useStoreState } from "@/app/hooks/hooks";
import { usePathname } from "next/navigation";

const UpdateNews = () => {
  const news = useStoreState((state) => state.news.news);
  const newsItem = news.find((p) => p.id === usePathname().split("/").pop())!;

  return <NewsForm news={newsItem} />;
};

export default UpdateNews;
