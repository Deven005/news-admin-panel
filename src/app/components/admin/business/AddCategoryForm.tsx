import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { Category } from "@/app/store/models/categoriesModel";

const validateSchema = Yup.object()
  .shape({
    categoryName: Yup.string().required("This field is required").min(5),
    categoryType: Yup.string().required("This field is required").min(5),
  })
  .required();

interface PropsType {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isEditCategory: boolean;
  setIsEditCategory: Dispatch<SetStateAction<boolean>>;
  categoryToEdit: Category | undefined;
  setCategoryToEdit: Dispatch<SetStateAction<Category | undefined>>;
}

function AddCategoryForm({
  isModalOpen,
  setIsModalOpen,
  isEditCategory,
  setIsEditCategory,
  categoryToEdit,
  setCategoryToEdit,
}: PropsType) {
  const [categoryIconImage, setCategoryIconImage] = useState<File | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditCategory && categoryToEdit != undefined) {
      setValue("categoryName", categoryToEdit.categoryName);
      setValue("categoryType", categoryToEdit.categoryType);
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });

  const onModalCancelHandler = () => {
    setCategoryIconImage(null);
    setIsModalOpen(false);
    setIsEditCategory(false);
    setCategoryToEdit(undefined);
    setIsLoading(true);
  };

  const handleAddCategory = async (event: any) => {
    const { categoryName, categoryType } = event;
    if (
      !isEditCategory &&
      (!categoryName || !categoryType || !categoryIconImage)
    ) {
      // add new category
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      if (!isEditCategory && categoryIconImage) {
        formData.append("categoryName", categoryName);
        formData.append("categoryType", categoryType.toLowerCase());
        formData.append("iconImage", categoryIconImage);
      } else {
        if (categoryToEdit!.categoryName != categoryName)
          formData.append("categoryName", categoryName);
        if (categoryIconImage) formData.append("iconImage", categoryIconImage);
      }

      const response = await doApiCall({
        url: `/admin/business${
          isEditCategory ? `/${categoryToEdit?.categoryID}` : ""
        }`,
        formData: formData,
        callType: isEditCategory ? "p" : "",
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      onModalCancelHandler();
      // alert(`Category ${!isEditCategory ? "added" : "updated"} successfully!`);
      showToast(`Category ${!isEditCategory ? "added" : "updated"}`, "s");
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding category:", error);
      showToast(
        `Error ${!isEditCategory ? "adding" : "updating"} category`,
        "e"
      );
    }
  };

  const handleCategoryIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCategoryIconImage(file);
    }
  };

  return (
    <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {isEditCategory ? "Edit" : "Add"} Category!
        </h3>

        {isLoading ? (
          <span className="loading loading-spinner w-1/4 text-center"></span>
        ) : (
          <form
            onSubmit={handleSubmit(handleAddCategory)}
            className="p-4 border rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="form-control w-full max-w-xl">
                <div className="label">
                  <span className="label-text">Category Name</span>
                </div>
                <input
                  type="text"
                  {...register("categoryName")}
                  placeholder="Category Name"
                  required={true}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </label>

              {errors.categoryName != undefined &&
                errors.categoryName?.message != undefined && (
                  <div role="alert" className="alert alert-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>{errors.categoryName?.message}</p>
                  </div>
                )}
            </div>
            {!isEditCategory && (
              <div className="mb-4">
                <label htmlFor="categoryType" className="block font-bold mb-2">
                  Category Type
                </label>
                <select
                  {...register("categoryType")}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="business">Business</option>
                  <option value="service">Service</option>
                </select>
                {errors.categoryType != undefined &&
                  errors.categoryType?.message != undefined && (
                    <div role="alert" className="alert alert-error">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>{errors.categoryType?.message}</p>
                    </div>
                  )}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="categoryIconImage"
                className="block font-bold mb-2"
              >
                Category Icon Image
              </label>
              <input
                type="file"
                id="categoryIconImage"
                name="categoryIconImage"
                onChange={handleCategoryIconChange}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              >
                {isEditCategory ? "Edit" : "Create"} Category
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                onClick={onModalCancelHandler}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddCategoryForm;
