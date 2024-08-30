import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { Reporter } from "@/app/store/models/reporter/reporterModel";
import { doApiCall, showToast } from "@/app/Utils/Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

interface ReporterFormType {
  reporterFirstName: string;
  reporterLastName: string;
  reporterEmail: string;
}

const validateSchema = Yup.object()
  .shape({
    reporterFirstName: Yup.string().required("This field is required").min(5),
    reporterLastName: Yup.string().required("This field is required").min(5),
    reporterEmail: Yup.string()
      .required("This field is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Not valid email"
      ),
  })
  .required();

interface PropsType {
  token: string;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isEditReporter: boolean;
  setIsEditReporter: Dispatch<SetStateAction<boolean>>;
  reporterToEditOrDelete: Reporter | undefined;
  setReporterToEditOrDelete: Dispatch<
    React.SetStateAction<Reporter | undefined>
  >;
  //   isEditCategory: boolean;
  //   setIsEditCategory: Dispatch<SetStateAction<boolean>>;
  //   categoryToEdit: Category | undefined;
  //   setCategoryToEdit: Dispatch<SetStateAction<Category | undefined>>;
}

function AddUpdateReporterForm({
  token,
  isModalOpen,
  setIsModalOpen,
  isEditReporter,
  setIsEditReporter,
  reporterToEditOrDelete,
  setReporterToEditOrDelete,
}: PropsType) {
  const { isLoading } = useStoreState((state) => state.reporter);
  const { setLoading } = useStoreActions((actions) => actions.reporter);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (isEditReporter && reporterToEditOrDelete) {
      setValue("reporterFirstName", reporterToEditOrDelete.reporterFirstName);
      setValue("reporterLastName", reporterToEditOrDelete.reporterLastName);
      setValue("reporterEmail", reporterToEditOrDelete.reporterEmail);
    }
  }, [isEditReporter, reporterToEditOrDelete]);

  const onModalCancelHandler = () => {
    setLoading(false);
    setIsModalOpen(false);
    setReporterToEditOrDelete(undefined);
    setIsEditReporter(false);
  };

  const handleAddUpdateReporter = async (event: ReporterFormType) => {
    try {
      setLoading(true);
      const { reporterFirstName, reporterLastName, reporterEmail } = event;
      const addUpdateReporterForm = new FormData();
      addUpdateReporterForm.append("reporterFirstName", reporterFirstName);
      addUpdateReporterForm.append("reporterLastName", reporterLastName);
      if (!isEditReporter) {
        addUpdateReporterForm.append("reporterEmail", reporterEmail);
      }

      const response = await doApiCall({
        url: `/reporter${
          isEditReporter ? `/${reporterToEditOrDelete?.reporterID}` : ""
        }`,
        formData: addUpdateReporterForm,
        callType: `${isEditReporter ? "p" : ""}`,
      });

      if (!response.ok) {
        throw new Error(await response.json());
      }
      console.log(`${isEditReporter ? "Update" : "Add"} reporter response: `);
      showToast(
        (await response.json())["message"] ??
          `${isEditReporter ? "Update" : "Add"} reporter is done!`,
        "s"
      );
      router.refresh();
      onModalCancelHandler();
    } catch (error: any) {
      console.log("add reporter error: ", error);
      showToast(
        error["message"] ??
          `${isEditReporter ? "Update" : "Add"} reporter is not done!`,
        "e"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {isEditReporter ? "Update" : "Add"} Reporter!
        </h3>

        {isLoading ? (
          <span className="loading loading-spinner w-1/4 text-center"></span>
        ) : (
          <form
            onSubmit={handleSubmit(handleAddUpdateReporter)}
            className="p-4 border rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="form-control w-full max-w-xl">
                <div className="label">
                  <span className="label-text">Reporter First Name</span>
                </div>
                <input
                  type="text"
                  {...register("reporterFirstName")}
                  placeholder="Reporter First Name"
                  required={true}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </label>

              {errors.reporterFirstName != undefined &&
                errors.reporterFirstName?.message != undefined && (
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
                    <p>{errors.reporterFirstName?.message}</p>
                  </div>
                )}
            </div>

            <div className="mb-4">
              <label className="form-control w-full max-w-xl">
                <div className="label">
                  <span className="label-text">Reporter Last Name</span>
                </div>
                <input
                  type="text"
                  {...register("reporterLastName")}
                  placeholder="Reporter Last Name"
                  required={true}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </label>

              {errors.reporterLastName != undefined &&
                errors.reporterLastName?.message != undefined && (
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
                    <p>{errors.reporterLastName?.message}</p>
                  </div>
                )}
            </div>

            {!isEditReporter && (
              <div className="mb-4">
                <label className="form-control w-full max-w-xl">
                  <div className="label">
                    <span className="label-text">Reporter Email</span>
                  </div>
                  <input
                    type="email"
                    {...register("reporterEmail")}
                    placeholder="Reporter Email"
                    required={true}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </label>

                {errors.reporterEmail != undefined &&
                  errors.reporterEmail?.message != undefined && (
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
                      <p>{errors.reporterEmail?.message}</p>
                    </div>
                  )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              >
                {isEditReporter ? "Update" : "Create"} Reporter
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

export default AddUpdateReporterForm;
