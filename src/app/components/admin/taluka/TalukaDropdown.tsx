import { firestore } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface TalukaPropType {
  mode: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const TalukaDropdown = ({ mode, register, errors }: TalukaPropType) => {
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalukas = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "talukaList")
        );
        const data = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Taluka)
        );
        setTalukas(data);
      } catch (error) {
        console.error("Error fetching talukas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTalukas();
  }, []);

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 font-semibold mb-2"
        htmlFor="taluka"
      >
        Taluka
      </label>
      <select
        id="taluka"
        className="w-full p-2 border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        // onChange={(e) => onSelect(e.target.value)}
        disabled={mode === "view"}
        {...register("talukaID", { required: "Taluka is required" })}
      >
        <option value="">Select a taluka</option>
        {loading ? (
          <option disabled>Loading...</option>
        ) : (
          talukas.map((taluka) => (
            <option key={taluka.id} value={taluka.id}>
              {taluka.talukaName}
            </option>
          ))
        )}
      </select>
      {errors.taluka && (
        <p className="text-red-500 text-xs italic mt-1">
          {errors.root?.message}
        </p>
      )}
    </div>
  );
};

export default TalukaDropdown;
export interface Taluka {
  id: string;
  talukaName: string;
  talukaIconImage: string;
  talukaImageFilePath: string;
  talukaClickCount: number;
  talukaCreatedAt: Date;
  talukaUpdatedAt: Date;
  isActive: boolean;
}
