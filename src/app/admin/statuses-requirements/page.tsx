"use client";
import PostRequirements from "@/app/components/admin/requirements/list/PostRequirements";
import Statuses from "@/app/components/admin/status/Statuses";
// import Statuses from "@/app/components/admin/statuses/Statuses";
// import PostRequirements from "@/app/components/admin/requirements/PostRequirements";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const StatusesAndRequirementsSuspense = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<
    "statuses" | "postRequirements"
  >("statuses");
  const [children, setChildren] = useState<JSX.Element>(<Statuses />);

  const handleTabChange = (tab: typeof selectedTab) => {
    setSelectedTab(tab);
    switch (tab) {
      case "statuses":
        setChildren(<Statuses />);
        break;
      case "postRequirements":
        setChildren(<PostRequirements />);
        break;
      default:
        setChildren(<p>Default View!</p>);
        break;
    }
    router.push(`?tab=${tab}`);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as
      | "statuses"
      | "postRequirements"
      | null;
    if (tab) {
      handleTabChange(tab);
    }
  }, [searchParams, router]);

  return (
    <div className="pt-3 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-center">
        Statuses & Requirements
      </h1>
      <div className="tabs tabs-boxed justify-center">
        <a
          className={`tab tab-lg tab-lifted ${
            selectedTab === "statuses" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("statuses")}
        >
          Statuses
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedTab === "postRequirements" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("postRequirements")}
        >
          Post Requirements
        </a>
      </div>
      <div className="card bg-base-100 shadow-lg">{children}</div>
    </div>
  );
};

const StatusesAndRequirements = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusesAndRequirementsSuspense />
    </Suspense>
  );
};

export default StatusesAndRequirements;
