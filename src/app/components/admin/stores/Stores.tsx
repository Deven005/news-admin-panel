"use client";
import Image from "next/image";
import Loading from "../../Loading";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { Store } from "@/app/store/models/admin/stores/storeModel";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { calculateDistance } from "@/app/Utils/Utils";

const Stores = () => {
  const { stores, isLoading } = useStoreState((state) => state.store);
  const { deleteStore } = useStoreActions((actions) => actions.store);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("inactive");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("distance");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const router = useRouter();
  const pathName = usePathname();

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  // Handle store item click
  const onStoreClickHandler = (id: string) => {
    router.push(`${pathName}/store/${id}`);
  };

  // Handle delete button click
  const onDeleteClickHandler = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(id);
    try {
      await deleteStore(id);
    } catch (error) {
      console.error("Error deleting store:", error);
    } finally {
      setDeleting(null); // Reset the deleting state
    }
  };

  // Filter, search, and sort stores
  const filteredStores = useMemo(() => {
    let filtered = stores;

    if (filter === "active") {
      filtered = filtered.filter((store) => store.isActive);
    } else if (filter === "inactive") {
      filtered = filtered.filter((store) => !store.isActive);
      if (filtered.length == 0) {
        setFilter("active");
      }
    } else if (filter === "delivery") {
      filtered = filtered.filter((store) => store.storeIsHomeDeliveryEnable);
    } else if (filter === "whatsapp") {
      filtered = filtered.filter((store) => store.storeWhatsappContact);
    } else if (filter === "open") {
      const now = new Date();
      const currentHour = now.getHours();
      filtered = filtered.filter((store) => {
        const openAt = parseInt(store.storeTiming.openAt, 10);
        const closeAt = parseInt(store.storeTiming.closeAt, 10);
        return openAt <= currentHour && closeAt > currentHour;
      });
    }

    // Search by name or description
    if (search) {
      filtered = filtered.filter(
        (store) =>
          store.storeName.toLowerCase().includes(search.toLowerCase()) ||
          store.storeDescription.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by selected criteria
    if (sortBy === "name") {
      filtered = filtered.sort((a, b) =>
        a.storeName.localeCompare(b.storeName)
      );
    } else if (sortBy === "contact") {
      filtered = filtered.sort((a, b) =>
        a.storeContact.localeCompare(b.storeContact)
      );
    } else if (sortBy === "distance" && userLocation) {
      filtered = filtered.sort(
        (a, b) =>
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.storeLatitude,
            a.storeLongitude
          ) -
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.storeLatitude,
            b.storeLongitude
          )
      );
    }

    return filtered;
  }, [stores, filter, search, sortBy, userLocation]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Stores List</h1>
        <p className="text-lg font-medium">
          Total Stores:{" "}
          <span className="font-bold">{filteredStores.length}</span>
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Dropdown Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg flex-1"
        >
          <option value="active">Active Stores</option>
          <option value="inactive">Inactive Stores</option>
          <option value="delivery">Home Delivery</option>
          <option value="whatsapp">WhatsApp Available</option>
          <option value="open">Open Now</option>
          <option value="all">All Stores</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg flex-1"
        />

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg flex-1"
        >
          <option value="name">Sort by Name</option>
          <option value="contact">Sort by Contact</option>
          <option value="distance">Sort by Distance</option>
        </select>
      </div>

      {/* No Results Found UI */}
      {filteredStores.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 rounded-lg shadow-lg">
          <div className="text-xl font-semibold mb-4">No Stores Found</div>
          <div className="text-lg text-center mb-6">
            We couldn't find any stores matching your criteria. Try adjusting
            your filters or search terms.
          </div>
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
            <Image
              src="/no-results-illustration.png" // Placeholder image URL
              alt="No Results"
              width={400}
              height={300}
              className="mx-auto mb-4"
            />
            <p className="text-gray-600 mb-4">
              It looks like we don't have any stores that match your search.
              Please try adjusting your filters or search terms.
            </p>
          </div>
        </div>
      )}

      {/* Stores Grid */}
      {filteredStores.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map((store: Store) => (
            <div
              key={store.storeID}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => onStoreClickHandler(store.storeID)}
            >
              <div className="relative h-48">
                <Image
                  src={store.storeImages[0] ?? "/placeholder.jpg"}
                  alt="Store Image"
                  layout="fill"
                  className="object-fill"
                  unoptimized
                  priority={true}
                />
                {/* Custom Close Icon */}
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  onClick={(e) => onDeleteClickHandler(store.storeID, e)}
                  disabled={deleting === store.storeID}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{store.storeName}</h2>
                <p className="text-gray-600">{store.storeDescription}</p>
                <p className="text-gray-500 mt-2">
                  Contact: {store.storeContact}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;
