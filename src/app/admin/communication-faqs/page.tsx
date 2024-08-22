"use client";
import EmergencyContacts from "@/app/components/admin/emergency_contacts/EmergencyContacts";
import FAQs from "@/app/components/admin/FAQs/FAQs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const CommunicationManagementAndFAQsSuspense = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<"emergencyContacts" | "faqs">(
    "emergencyContacts"
  );
  const [children, setChildren] = useState<JSX.Element>(<EmergencyContacts />);

  const handleTabChange = (tab: typeof selectedTab) => {
    setSelectedTab(tab);
    switch (tab) {
      case "emergencyContacts":
        setChildren(<EmergencyContacts />);
        break;
      case "faqs":
        setChildren(<FAQs />);
        break;
      default:
        setChildren(<p>Default View!</p>);
        break;
    }
    router.push(`?tab=${tab}`);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as "emergencyContacts" | "faqs" | null;
    if (tab) {
      handleTabChange(tab);
    }
  }, [searchParams, router]);

  return (
    <div className="pt-3 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-center">
        Communication Management & FAQs
      </h1>
      <div className="tabs tabs-boxed justify-center">
        <a
          className={`tab tab-lg tab-lifted ${
            selectedTab === "emergencyContacts" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("emergencyContacts")}
        >
          Emergency Contacts
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            selectedTab === "faqs" ? "tab-active" : ""
          }`}
          onClick={() => handleTabChange("faqs")}
        >
          FAQs
        </a>
      </div>
      <div className="card bg-base-100 shadow-lg">{children}</div>
    </div>
  );
};

const CommunicationManagementAndFAQs = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommunicationManagementAndFAQsSuspense />
    </Suspense>
  );
};

export default CommunicationManagementAndFAQs;
