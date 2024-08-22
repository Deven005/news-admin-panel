"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import Loading from "../../Loading";
import { formatDate } from "@/app/Utils/Utils";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePathname, useRouter } from "next/navigation";
import InputField from "../../InputField";
import InputTextAreaField from "../../InputTextAreaField";

const FAQSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title is too long"),
  description: Yup.string().required("Description is required"),
});

const FAQs = () => {
  const { admins } = useStoreState((state) => state.admin);
  const { faqs, loading } = useStoreState((state) => state.faqs);
  const { updateFAQ, deleteFAQ } = useStoreActions((actions) => actions.faqs);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const router = useRouter();
  const pathName = usePathname();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FAQSchema),
  });

  const handleEditClick = (index: number, faq: any) => {
    setEditingIndex(index);
    setValue("title", faq.title);
    setValue("description", faq.description);
  };

  const handleSaveClick = async (data: any, faqId: string) => {
    try {
      await updateFAQ({
        id: faqId,
        title: data.title,
        description: data.description,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  const handleDeleteClick = async (faqId: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFAQ(faqId);
    }
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
    reset();
  };

  const handleMarkInactiveClick = async (faqId: string, isActive: boolean) => {
    try {
      await updateFAQ({ id: faqId, isActive: !isActive });
    } catch (error) {
      console.error("Error updating FAQ status:", error);
    }
  };

  const addNewFaqClickHandler = () => {
    setEditingIndex(-1);
    router.push(`${pathName}/faqs/add`);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Frequently Asked Questions
        </h1>
        <button
          onClick={addNewFaqClickHandler}
          className="btn btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-700 text-white hover:from-indigo-600 hover:to-purple-800 transition-transform transform hover:scale-105"
        >
          <span className="font-semibold">Add FAQ</span>
        </button>
      </div>

      {faqs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No FAQs Available
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            It seems there are no FAQs at the moment. Click the "Add FAQ" button
            above to create the first one.
          </p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, duration: 2, ease: "linear" }}
            className="flex justify-center"
          >
            <svg
              className="w-24 h-24 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.428 15.518a9 9 0 10-2.325 2.325l2.387 2.387m.707-5.093a7 7 0 11-2.12-2.121"
              ></path>
            </svg>
          </motion.div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => {
            const addedBy = admins.find((admin) => admin.id == faq.addedBy);
            return (
              <motion.div
                key={index}
                className={`card shadow-lg p-6 bg-white border border-gray-200 rounded-xl transform transition-transform hover:scale-105 ${
                  !faq.isActive ? "opacity-60" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {editingIndex === index ? (
                  <form
                    onSubmit={handleSubmit((data) =>
                      handleSaveClick(data, faq.id)
                    )}
                    className="space-y-4"
                  >
                    <InputField
                      type="text"
                      label="Title"
                      placeholder="Title"
                      register={register("title")}
                      error={errors.title}
                    />
                    <InputTextAreaField
                      label="Description"
                      placeholder="Description"
                      register={register("description")}
                      error={errors.description}
                      rows={4}
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        type="submit"
                        className="btn btn-success rounded-lg px-4 py-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="btn btn-secondary rounded-lg px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {faq.title}
                      </h2>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditClick(index, faq)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(faq.id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            handleMarkInactiveClick(faq.id, faq.isActive)
                          }
                          className={`${
                            faq.isActive
                              ? "text-yellow-600 hover:text-yellow-800"
                              : "text-green-600 hover:text-green-800"
                          } focus:outline-none`}
                        >
                          {faq.isActive ? "Mark Inactive" : "Mark Active"}
                        </button>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 mb-6">
                      {faq.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>
                        Added By:{" "}
                        {`${addedBy?.userFirstName} ${addedBy?.userLastName}`}
                      </p>
                      <p>Created At: {formatDate(faq.createdAt)}</p>
                      <p>Updated At: {formatDate(faq.updatedAt)}</p>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FAQs;
