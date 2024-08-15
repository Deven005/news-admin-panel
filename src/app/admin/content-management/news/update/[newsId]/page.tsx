"use client";
import NewsForm from "@/app/components/news/NewsForm";
import { useStoreState } from "@/app/hooks/hooks";
import { usePathname } from "next/navigation";

const UpdateNews = () => {
  const usePath = usePathname();
  const news = useStoreState((state) => state.news.news);
  const newsItem = news.find((p) => p.id === usePath.split("/").pop())!;

  return <NewsForm news={newsItem} />;
};

export default UpdateNews;
