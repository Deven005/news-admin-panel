"use client";
import AddCategoryForm from "@/app/components/admin/business/AddCategoryForm";
import Loading from "@/app/components/Loading";
import MyNavBar from "@/app/components/MyNavBar";
import { firestore } from "@/app/firebase/config";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { Category } from "@/app/store/models/categoriesModel";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const Business = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [categoryToEditOrDelete, setCategoryToEditOrDelete] = useState<
    Category | undefined
  >();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const categories = useStoreState((state) => state.category.categories);
  const categoryCounts = useStoreState(
    (state) => state.category.categoryCounts
  );
  const categoriesFilter = useStoreState(
    (state) => state.category.categoriesFilter
  );
  const selectedType = useStoreState((state) => state.category.selectedType);
  const addCategory = useStoreActions((state) => state.category.addCategory);
  const updateCategory = useStoreActions(
    (state) => state.category.updateCategory
  );
  const deleteCategory = useStoreActions(
    (state) => state.category.deleteCategory
  );
  const changeSelectedTypeAction = useStoreActions(
    (state) => state.category.changeSelectedTypeAction
  );

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      collection(firestore, "categoryList"),
      async (snapshot) => {
        setIsLoading(true);
        snapshot.docChanges().forEach((change) => {
          var changedCatIndex: number = categories.findIndex(
            (val) => val.categoryID == change.doc.id
          );

          const catData = change.doc.data();

          if (change.type === "added" && changedCatIndex == -1) {
            // Handle added document

            // categories.push({
            //   categoryID: change.doc.id,
            //   categoryCreatedAt: catData["categoryCreatedAt"],
            //   categoryIconImage: catData["categoryIconImage"],
            //   categoryName: catData["categoryName"],
            //   categoryType: catData["categoryType"],
            //   categoryUpdatedAt: catData["categoryUpdatedAt"],
            //   categoryFilePath: catData["categoryFilePath"],
            // } as Category);

            addCategory({
              categoryID: change.doc.id,
              categoryCreatedAt: catData["categoryCreatedAt"],
              categoryIconImage: catData["categoryIconImage"],
              categoryName: catData["categoryName"],
              categoryType: catData["categoryType"],
              categoryUpdatedAt: catData["categoryUpdatedAt"],
              categoryFilePath: catData["categoryFilePath"],
            } as Category);
          } else if (change.type === "modified") {
            // Handle modified document

            if (changedCatIndex !== -1) {
              // var updateCat = categories[changedCatIndex];
              // updateCat.categoryIconImage = catData["categoryIconImage"];
              // updateCat.categoryFilePath = catData["categoryFilePath"];
              // updateCat.categoryName = catData["categoryName"];
              // updateCat.categoryUpdatedAt = catData["categoryUpdatedAt"];
              // categories[changedCatIndex] = updateCat;

              updateCategory({ changedCatIndex, catData });
            }
          } else if (change.type === "removed") {
            // Handle removed document

            if (changedCatIndex !== -1) {
              // categories.splice(changedCatIndex, 1);
              deleteCategory(changedCatIndex);
            }
          }
        });
        // setCategories(categories);

        // var categoriesFilter = categories.filter(
        //   (val) => val.categoryType.toLowerCase() == selectedType.toLowerCase()
        // );
        // setCategoriesFilter(categoriesFilter);

        // const categoryCounts = categories.reduce(
        //   (acc, category) => {
        //     if (category.categoryType === "business") {
        //       acc.business++;
        //     } else if (category.categoryType === "service") {
        //       acc.service++;
        //     }
        //     return acc;
        //   },
        //   { business: 0, service: 0 }
        // );
        // setCategoriesCount(categoryCounts);

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
      console.log("delete: response: ", response);
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
      <button className="btn text-right" onClick={() => setIsModalOpen(true)}>
        Add Category
      </button>

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

      <div className="grid grid-cols-3 gap-4">
        <div></div>
        <div className="flex justify-center items-center">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="mb-4">
                <label htmlFor="categoryType" className="block font-bold mb-2">
                  Category Type
                </label>
                <select
                  value={selectedType}
                  onChange={(event) =>
                    changeSelectedTypeAction(event.target.value.toLowerCase())
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="business">Business</option>
                  <option value="service">Service</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-center">Total Categories: {categories?.length}</p>
          <p className="text-center">
            Business Categories: {categoryCounts?.business}
          </p>
          <p className="text-center">
            Service Categories: {categoryCounts?.service}
          </p>
        </div>
      </div>

      {categoriesFilter && categoriesFilter.length <= 0 ? (
        <p className="text-center pt-28">No Data to show!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-xs table-pin-rows table-pin-cols text-center">
            <thead className="bg-blue-600 ">
              <tr>
                <th>#</th>
                <td>Image</td>
                <td>Name</td>
                {/* <td>Type</td> */}
                <td>Created At</td>
                <td>Modified At</td>
                <td></td>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categoriesFilter &&
                categoriesFilter.map((cat, index) => {
                  return (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>
                        <div className="avatar">
                          <div className="w-14 rounded-xl">
                            <img src={cat.categoryIconImage} />
                          </div>
                        </div>
                      </td>
                      <td>{cat.categoryName}</td>
                      <td>
                        {new Date(
                          cat.categoryCreatedAt.seconds * 1000 +
                            cat.categoryCreatedAt.nanoseconds / 1e6
                        ).toLocaleTimeString("en-US")}
                      </td>
                      <td>
                        {new Date(
                          cat.categoryUpdatedAt.seconds * 1000 +
                            cat.categoryUpdatedAt.nanoseconds / 1e6
                        ).toLocaleTimeString("en-US")}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          data-te-ripple-init
                          data-te-ripple-color="light"
                          onClick={() => editCategoryClickHandler(cat)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-error"
                          data-te-ripple-init
                          data-te-ripple-color="dark"
                          onClick={() => deleteCategoryClickHandler(cat)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {
        //delete model
        <div className={`modal ${isDeleteModalOpen ? "modal-open" : ""}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Do you want to delete the category?
            </h3>
            <div className="modal-action">
              <form method="dialog">
                <div className="grid grid-cols-4 gap-4">
                  <div></div>
                  <button
                    className="btn btn-error text-white"
                    onClick={deleteCategoryApiCall}
                  >
                    Yes
                  </button>
                  <button
                    className="btn"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Business;
