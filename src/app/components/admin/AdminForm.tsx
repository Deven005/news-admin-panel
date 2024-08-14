"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { AddAdminType, Admin } from "@/app/store/models/admin/adminModel";
import Loading from "../Loading";

type AdminFormProps = {
  initialData?: Admin;
};

const validationSchema = Yup.object().shape({
  userFirstName: Yup.string().required("First Name is required"),
  userLastName: Yup.string().required("Last Name is required"),
  userEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const AdminForm = ({ initialData }: AdminFormProps) => {
  const router = useRouter();
  const { addAdmin, updateAdmin } = useStoreActions((actions) => actions.admin);
  const loading = useStoreState((states) => states.admin.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<AddAdminType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userFirstName: initialData?.userFirstName || "",
      userLastName: initialData?.userLastName || "",
      userEmail: initialData?.userEmail || "",
    },
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (adminFormData: AddAdminType) => {
    try {
      if (initialData) {
        // Update logic
        await updateAdmin({
          userUid: initialData.userUid,
          userFirstName: adminFormData.userFirstName,
          userLastName: adminFormData.userLastName,
        });
      } else {
        // Add logic
        await addAdmin(adminFormData);
      }
      router.back();
    } catch (error) {
      console.log("add / update admin err: ", error);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {initialData ? "Update Admin" : "Add Admin"}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            {...register("userFirstName")}
            type="text"
            className={`input input-bordered w-full ${
              errors.userFirstName ? "border-red-500" : ""
            }`}
          />
          {errors.userFirstName && (
            <p className="text-red-500 text-sm">
              {errors.userFirstName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            {...register("userLastName")}
            type="text"
            className={`input input-bordered w-full ${
              errors.userLastName ? "border-red-500" : ""
            }`}
          />
          {errors.userLastName && (
            <p className="text-red-500 text-sm">
              {errors.userLastName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            {...register("userEmail")}
            type="email"
            className={`input input-bordered w-full ${
              errors.userEmail ? "border-red-500" : ""
            }`}
          />
          {errors.userEmail && (
            <p className="text-red-500 text-sm">{errors.userEmail.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4">
          {initialData ? "Update Admin" : "Add Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminForm;
