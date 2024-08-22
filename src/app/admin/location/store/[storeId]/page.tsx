"use client";

import Image from "next/image";
import { useStoreState, useStoreActions } from "@/app/hooks/hooks";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import { useState } from "react";
import GoogleMapComponent from "@/app/components/google-map/GoogleMapComponent";
import { formatDate } from "@/app/Utils/Utils";

const StoreDetails = () => {
  const pathname = usePathname();
  const storeID = pathname.split("/").pop();
  const { stores } = useStoreState((state) => state.store);
  const { updateStore, deleteStore } = useStoreActions(
    (actions) => actions.store
  );
  const store = stores.find((store) => store.storeID === storeID);
  const router = useRouter();

  const [mapCenter, setMapCenter] = useState({
    lat: store?.storeLatitude || 37.7749,
    lng: store?.storeLongitude || -122.4194,
  });

  const [isActive, setIsActive] = useState(store?.isActive ?? false);

  if (!store) return <Loading />;

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setMapCenter(location);
  };

  const handleStatusToggle = async () => {
    try {
      if (!storeID) return;
      const updatedStatus = !isActive;
      setIsActive(updatedStatus);
      await updateStore({ storeID, isActive: updatedStatus });
    } catch (error) {
      console.error("Failed to update store status:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        if (storeID) {
          await deleteStore(storeID);
          router.push("/stores"); // Redirect to the list of stores or any other page after deletion
        }
      } catch (error) {
        console.error("Failed to delete store:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="relative h-80">
          <Image
            src={store.storeImages[0] ?? "/placeholder.jpg"}
            alt={`${store.storeName} Image`}
            layout="fill"
            className="object-cover transition-transform duration-500 hover:scale-105"
            unoptimized
            priority
          />
        </div>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              {store.storeName}
            </h1>
            {/* <button
              onClick={() =>
                router.push(
                  pathname.replace(
                    `/${store.storeID}`,
                    `/edit/${store.storeID}`
                  )
                )
              }
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit
            </button> */}
            <button
              onClick={handleStatusToggle}
              className={`px-4 py-2 rounded-lg text-white ${
                isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {store.storeDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {store.storeEmail || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Phone:</strong> {store.storeContact || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>WhatsApp:</strong> {store.storeWhatsappContact || "N/A"}
              </p>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Address
              </h3>
              <p className="text-gray-600">{store.storeAddress}</p>
            </div>

            {/* Store Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Store Details
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>Category:</strong> {store.storeCategoryID || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Type:</strong> {store.storeType || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Open:</strong> {store.storeTiming.openAt || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Close:</strong> {store.storeTiming.closeAt || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Home Delivery:</strong>{" "}
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    store.storeIsHomeDeliveryEnable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {store.storeIsHomeDeliveryEnable
                    ? "Available"
                    : "Not Available"}
                </span>
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Closed on:</strong> {store.storeClosingDay || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Location */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Location
              </h3>
              <div className="relative h-60 mb-4">
                <GoogleMapComponent
                  draggable={false}
                  onLocationSelect={handleLocationSelect}
                  initialLatitude={store.storeLatitude}
                  initialLongitude={store.storeLongitude}
                />
              </div>
              <p className="text-gray-600 mb-1">
                <strong>Latitude:</strong> {store.storeLatitude}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Longitude:</strong> {store.storeLongitude}
              </p>
            </div>

            {/* Owner */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Owner
              </h3>
              <p className="text-gray-600">{store.storeOwner}</p>
            </div>

            {/* UPI Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                UPI Information
              </h3>
              {store.storeUpiList.length > 0 ? (
                store.storeUpiList.map((upi, index) => (
                  <div key={index} className="relative group mb-2">
                    <p className="text-gray-600">
                      <strong>{upi.provider}:</strong> {upi.upiId}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-lg font-semibold">{upi.upiId}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No UPI information available.</p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div></div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Created At
              </h3>
              <p className="text-gray-600">
                {formatDate(store.storeCreatedAt)}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Last Updated
              </h3>
              <p className="text-gray-600">
                {formatDate(store.storeUpdatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
