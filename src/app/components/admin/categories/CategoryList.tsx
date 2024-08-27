"use client";

import AddCategoryForm from "@/app/components/admin/business/AddCategoryForm";
import Loading from "@/app/components/Loading";
import { firestore } from "@/app/firebase/config";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { Category } from "@/app/store/models/categoriesModel";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

const Business = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [categoryToEditOrDelete, setCategoryToEditOrDelete] = useState<
    Category | undefined
  >();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { categories, categoryCounts, selectedType, categoriesFilter } =
    useStoreState((state) => state.category);

  const {
    addCategory,
    updateCategory,
    deleteCategory,
    changeSelectedTypeAction,
  } = useStoreActions((state) => state.category);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      collection(firestore, "categoryList"),
      async (snapshot) => {
        setIsLoading(true);
        snapshot.docChanges().forEach((change) => {
          const changedCatIndex: number = categories.findIndex(
            (val) => val.categoryID === change.doc.id
          );
          const catData = change.doc.data();

          if (change.type === "added" && changedCatIndex === -1) {
            addCategory({
              categoryID: change.doc.id,
              categoryCreatedAt: catData["categoryCreatedAt"],
              categoryIconImage: catData["categoryIconImage"],
              categoryName: catData["categoryName"],
              categoryType: catData["categoryType"],
              categoryUpdatedAt: catData["categoryUpdatedAt"],
              categoryFilePath: catData["categoryFilePath"],
            } as Category);
          } else if (change.type === "modified" && changedCatIndex !== -1) {
            updateCategory({ changedCatIndex, catData });
          } else if (change.type === "removed" && changedCatIndex !== -1) {
            deleteCategory(changedCatIndex);
          }
        });
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  function editCategoryClickHandler(cat: Category) {
    setCategoryToEditOrDelete(cat);
    setIsEditCategory(true);
    setIsModalOpen(true);
  }

  async function deleteCategoryApiCall() {
    try {
      setIsLoading(true);
      setIsDeleteModalOpen(false);
      const response = await doApiCall({
        url: `/admin/business/${categoryToEditOrDelete!.categoryID}?file-path=${
          categoryToEditOrDelete!.categoryFilePath
        }`,
        formData: new FormData(),
        callType: "d",
      });
      setCategoryToEditOrDelete(undefined);
      setIsLoading(false);
      if (response.ok) {
        showToast("Deleted!", "s");
      } else {
        showToast("Not Deleted!", "e");
      }
    } catch (error) {
      setIsLoading(false);
      showToast("Not Deleted!", "e");
    }
  }

  async function deleteCategoryClickHandler(cat: Category) {
    setCategoryToEditOrDelete(cat);
    setIsDeleteModalOpen(true);
  }

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="mb-6 flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Add Category
        </button>
      </div>

      {isModalOpen && (
        <AddCategoryForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isEditCategory={isEditCategory}
          setIsEditCategory={setIsEditCategory}
          categoryToEdit={categoryToEditOrDelete}
          setCategoryToEdit={setCategoryToEditOrDelete}
        />
      )}

      <div className="mb-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="categoryType"
            className="font-semibold text-lg text-gray-700"
          >
            Category Type:
          </label>
          <select
            id="categoryType"
            value={selectedType}
            onChange={(event) =>
              changeSelectedTypeAction(event.target.value.toLowerCase())
            }
            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="business">Business</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">
            Total Categories: {categories?.length}
          </p>
          <p className="text-sm text-gray-600">
            Business Categories: {categoryCounts?.business}
          </p>
          <p className="text-sm text-gray-600">
            Service Categories: {categoryCounts?.service}
          </p>
        </div>
      </div>

      {categoriesFilter && categoriesFilter.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No Data to show!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr className="text-center">
                <th className="p-4">#</th>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Modified At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesFilter.map((cat, index) => (
                <tr
                  key={index}
                  className="border-b transition-transform hover:scale-105 shadow-lg text-center"
                >
                  <td className="p-4 text-gray-800">{index + 1}</td>
                  <td className="p-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                      <Image
                        src={cat.categoryIconImage}
                        alt={cat.categoryName}
                        className="object-cover w-full h-full"
                        height={64}
                        width={64}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-gray-800">{cat.categoryName}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(
                      cat.categoryCreatedAt.seconds * 1000 +
                        cat.categoryCreatedAt.nanoseconds / 1e6
                    ).toLocaleTimeString("en-US")}
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(
                      cat.categoryUpdatedAt.seconds * 1000 +
                        cat.categoryUpdatedAt.nanoseconds / 1e6
                    ).toLocaleTimeString("en-US")}
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                      onClick={() => editCategoryClickHandler(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                      onClick={() => deleteCategoryClickHandler(cat)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Delete
            </h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete the category "
              {categoryToEditOrDelete?.categoryName}"?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
                onClick={deleteCategoryApiCall}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-50" />
        </div>
      )}
    </>
  );
};

export default Business;
