"use client";
import CategoryList from "@/app/components/admin/categories/CategoryList";
import RequirementCategories from "@/app/components/admin/requirements/RequirementCategories";
import StatusCategories from "@/app/components/admin/status/StatusCategories";
// import RequirementCategories from "@/app/components/admin/categories/RequirementCategories";
// import StatusCategories from "@/app/components/admin/categories/StatusCategories";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const CategoriesSuspense = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<
    "categoryList" | "requirementCategories" | "statusCategories"
  >("categoryList");
  const [children, setChildren] = useState<JSX.Element>(<CategoryList />);

  const handleTabChange = (tab: typeof selectedTab) => {
    setSelectedTab(tab);
    switch (tab) {
      case "categoryList":
        setChildren(<CategoryList />);
        break;
      case "requirementCategories":
        setChildren(<RequirementCategories />);
        break;
      case "statusCategories":
        setChildren(<StatusCategories />);
        break;
      default:
        setChildren(<p>Default View!</p>);
        break;
    }
    router.push(`?tab=${tab}`);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as
      | "categoryList"
      | "requirementCategories"
      | "statusCategories"
      | null;
    if (tab) {
      handleTabChange(tab);
    }
  }, [searchParams, router]);

  return (
    <div className="pt-3 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-center">Categories</h1>
      <div className="tabs tabs-boxed justify-center">
        <a
          className={`tab tab-lg tab-lifted ${
            selectedTab === "categoryList" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("categoryList")}
        >
          Category List
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedTab === "requirementCategories" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("requirementCategories")}
        >
          Requirement Categories
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedTab === "statusCategories" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("statusCategories")}
        >
          Status Categories
        </a>
      </div>
      <div className="card bg-base-100 shadow-lg">{children}</div>
    </div>
  );
};

const Categories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesSuspense />
    </Suspense>
  );
};

export default Categories;
