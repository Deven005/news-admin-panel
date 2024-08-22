"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useStoreState, useStoreActions } from "@/app/hooks/hooks";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../../InputField";

// Define schema for form validation
const ContactSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  contact: Yup.string().required("Contact is required"),
});

const NewGroupSchema = Yup.object().shape({
  groupTitle: Yup.string().required("Group title is required"),
  groupImage: Yup.string().required("Group image URL is required"),
});

interface FormData {
  title: string;
  contact: string;
}

interface NewGroupData {
  groupTitle: string;
  groupImage: string;
}

const EmergencyContacts = () => {
  const { emergencyContacts } = useStoreState(
    (state) => state.emergencyContacts
  );
  const {
    updateContact,
    deleteContact,
    addContact,
    addEmergencyContactGroup,
    deleteEmergencyContactGroup,
  } = useStoreActions((actions) => actions.emergencyContacts);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedContactGroup, setSelectedContactGroup] = useState<
    string | null
  >(null);
  const [addingContact, setAddingContact] = useState<boolean>(false);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [addingGroup, setAddingGroup] = useState<boolean>(false);

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    setValue: setValueContact,
    reset: resetContact,
    formState: { errors: contactErrors },
  } = useForm<FormData>({
    resolver: yupResolver(ContactSchema),
  });

  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroup,
    reset: resetGroup,
    formState: { errors: groupErrors },
  } = useForm<NewGroupData>({
    resolver: yupResolver(NewGroupSchema),
  });

  useEffect(() => {
    if (editingIndex !== null && selectedContactGroup !== null) {
      const contactGroup = emergencyContacts.find(
        (group) => group.id === selectedContactGroup
      );
      if (contactGroup) {
        const contact = contactGroup.contacts[editingIndex];
        if (contact) {
          setValueContact("title", contact.title);
          setValueContact("contact", contact.contact);
        }
      }
    } else {
      resetContact();
    }
  }, [
    editingIndex,
    selectedContactGroup,
    emergencyContacts,
    setValueContact,
    resetContact,
  ]);

  const handleEditClick = (groupId: string, contactIndex: number) => {
    setEditingIndex(contactIndex);
    setSelectedContactGroup(groupId);
    setAddingContact(false);
  };

  const handleSaveClick = async (data: FormData) => {
    if (selectedContactGroup && editingIndex !== null) {
      await updateContact({
        groupId: selectedContactGroup,
        contactIndex: editingIndex,
        title: data.title,
        contact: data.contact,
      });
      resetEditing();
    }
  };

  const handleAddClick = (groupId: string) => {
    setAddingContact(true);
    setEditingIndex(null);
    setCurrentGroupId(groupId);
  };

  const handleAddSaveClick = async (data: FormData) => {
    if (currentGroupId) {
      await addContact({
        groupId: currentGroupId,
        title: data.title,
        contact: data.contact,
      });
      resetAdding();
    }
  };

  const handleDeleteClick = async (groupId: string, contactIndex: number) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      await deleteContact({ groupId, contactIndex });
    }
  };

  const handleDeleteGroupClick = async (groupId: string) => {
    if (confirm("Are you sure you want to delete this contact group?")) {
      await deleteEmergencyContactGroup({ groupId });
    }
  };

  const resetEditing = () => {
    setEditingIndex(null);
    setSelectedContactGroup(null);
    resetContact();
  };

  const resetAdding = () => {
    setAddingContact(false);
    setCurrentGroupId(null);
    resetContact();
  };

  const handleCancelClick = () => {
    resetEditing();
    resetAdding();
  };

  const handleAddGroupClick = () => {
    setAddingGroup(true);
  };

  const handleAddGroupSaveClick = async (data: NewGroupData) => {
    await addEmergencyContactGroup({
      title: data.groupTitle,
      contactImg: data.groupImage,
    });
    setAddingGroup(false);
    resetGroup();
  };

  const handleCancelGroupClick = () => {
    setAddingGroup(false);
    resetGroup();
  };

  return (
    <div className="pt-4 md:pt-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl font-bold text-gray-800">Emergency Contacts</h1>
        {!addingGroup && (
          <button
            onClick={handleAddGroupClick}
            className="btn btn-primary px-2 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
          >
            + Add New Group
          </button>
        )}
      </div>

      {/* Add New Group Section */}
      {addingGroup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Add New Contact Group</h2>
          <form onSubmit={handleSubmitGroup(handleAddGroupSaveClick)}>
            <InputField
              type="text"
              label="Group Title"
              placeholder="Enter group title"
              {...registerGroup("groupTitle")}
              error={groupErrors.groupTitle}
            />
            <InputField
              type="text"
              label="Group Image URL"
              placeholder="Enter image URL"
              {...registerGroup("groupImage")}
              error={groupErrors.groupImage}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-success px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
              >
                Add Group
              </button>
              <button
                type="button"
                onClick={handleCancelGroupClick}
                className="btn btn-secondary px-4 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {emergencyContacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            No Emergency Contacts Available
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            There are no emergency contacts at the moment. Add new contacts to
            see them here.
          </p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, duration: 2, ease: "linear" }}
            className="flex justify-center"
          >
            <svg
              className="w-20 h-20 text-indigo-500"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emergencyContacts.map((contactGroup) => (
            <motion.div
              key={contactGroup.id}
              className="card shadow-md p-4 bg-white rounded-lg transition-transform transform hover:scale-105"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={contactGroup.contactImg || "/default-img.jpg"}
                    alt={contactGroup.contactTitle}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full"
                  />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {contactGroup.contactTitle}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddClick(contactGroup.id)}
                    className="btn btn-primary px-3 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Add Contact
                  </button>
                  <button
                    onClick={() => handleDeleteGroupClick(contactGroup.id)}
                    className="btn btn-danger px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600"
                  >
                    Delete Group
                  </button>
                </div>
              </div>
              <div>
                {contactGroup.contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-4"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {contact.title}
                      </h3>
                      <p className="text-sm text-gray-600">{contact.contact}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(contactGroup.id, index)}
                        className="btn btn-secondary px-3 py-1 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(contactGroup.id, index)
                        }
                        className="btn btn-danger px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Contact Section */}
      {(addingContact || editingIndex !== null) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-md mt-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingIndex !== null ? "Edit Contact" : "Add New Contact"}
          </h2>
          <form
            onSubmit={handleSubmitContact(
              editingIndex !== null ? handleSaveClick : handleAddSaveClick
            )}
          >
            <InputField
              type="text"
              label="Title"
              placeholder="Enter title"
              {...registerContact("title")}
              error={contactErrors.title}
            />
            <InputField
              type="text"
              label="Contact"
              placeholder="Enter contact"
              {...registerContact("contact")}
              error={contactErrors.contact}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-success px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
              >
                {editingIndex !== null ? "Save" : "Add Contact"}
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                className="btn btn-secondary px-4 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default EmergencyContacts;
