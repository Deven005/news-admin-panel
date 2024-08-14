"use client";
import Loading from "@/app/components/Loading";
import { useStoreState } from "@/app/hooks/hooks";
import { formatDate, showToast } from "@/app/Utils/Utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const TalukaDetails = () => {
  const pathname = usePathname();
  const talukaID = pathname.split("/").pop();
  const router = useRouter();

  const talukas = useStoreState((state) => state.taluka.talukas);
  const taluka = talukas.find((p) => p.id === talukaID);

  if (!taluka) {
    return <Loading />;
  }

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "s");
  };

  const handleEditClick = () => {
    router.push(`/admin/taluka/update/${talukaID}`);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          {taluka.talukaName}
        </h1>
        <Image
          src={taluka.talukaIconImage}
          alt={taluka.talukaName}
          className="w-20 h-20 object-fill rounded"
          height={100}
          width={100}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <strong className="text-gray-700">Created At:</strong>
          <span className="text-gray-600">
            {formatDate(new Date(taluka.talukaCreatedAt))}
          </span>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleCopyClick(formatDate(taluka.talukaCreatedAt))}
          >
            Copy
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <strong className="text-gray-700">Updated At:</strong>
          <span className="text-gray-600">
            {formatDate(new Date(taluka.talukaUpdatedAt))}
          </span>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleCopyClick(formatDate(taluka.talukaUpdatedAt))}
          >
            Copy
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <strong className="text-gray-700">Status:</strong>
          <span
            className={`${
              taluka.isActive ? "text-green-500" : "text-red-500"
            } font-semibold`}
          >
            {taluka.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <strong className="text-gray-700">Click Count:</strong>
          <span className="text-gray-600">{taluka.talukaClickCount}</span>
        </div>
        <div className="flex items-center space-x-4">
          <strong className="text-gray-700">Image File Path:</strong>
          <span className="text-gray-600 truncate">
            {taluka.talukaImageFilePath}
          </span>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleCopyClick(taluka.talukaImageFilePath)}
          >
            Copy
          </button>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button className="btn btn-primary" onClick={handleEditClick}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default TalukaDetails;
