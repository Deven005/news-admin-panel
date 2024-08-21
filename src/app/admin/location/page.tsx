"use client";
import Stores from "@/app/components/admin/stores/Stores";
import Talukas from "@/app/components/admin/taluka/Talukas";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ContentManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedContentType, setSelectedContentType] = useState<
    "taluka" | "stores"
  >("stores");
  const [children, setChildren] = useState<JSX.Element>();

  const handleContentTypeChange = (type: typeof selectedContentType) => {
    setSelectedContentType(type);
    switch (type) {
      case "taluka":
        setChildren(<Talukas />);
        break;

      case "stores":
        setChildren(<Stores />);
        break;

      default:
        setChildren(<p>Default View!</p>);
        break;
    }
    router.push(`?contentType=${type}`);
  };

  useEffect(() => {
    const type = searchParams.get("contentType") as "taluka" | "stores" | null;
    if (type) {
      handleContentTypeChange(type);
    } else {
      handleContentTypeChange("stores");
    }
  }, [searchParams]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Content Management
      </h1>
      <div className="tabs tabs-boxed justify-center mb-8">
        <a
          className={`tab tab-lg tab-lifted ${
            selectedContentType === "stores" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("stores")}
        >
          Stores
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedContentType === "taluka" && "tab-active"
          }`}
          onClick={() => handleContentTypeChange("taluka")}
        >
          Taluka List
        </a>
      </div>
      <div className="card bg-base-100 shadow-lg p-6">{children}</div>
    </div>
  );
};

export default ContentManagement;
