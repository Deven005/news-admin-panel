"use client";
import Loading from "@/app/components/Loading";
import TalukaForm from "@/app/components/taluka/TalukaForm";
import { useStoreActions, useStoreState } from "@/app/hooks/hooks";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import React from "react";

const AddTalukaForm = () => {
  const [talukaName, setTalukaName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const addOrUpdateTaluka = useStoreActions(
    (actions) => actions.taluka.addOrUpdateTaluka
  );
  const isLoading = useStoreState((states) => states.taluka.isLoading);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await addOrUpdateTaluka({ talukaName, isActive, image });
      setTalukaName("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input value
      }
      router.back();
    } catch (error) {
      console.log("add taluka err: ", error);
    }
  };

  return isLoading ? <Loading /> : <TalukaForm />;
};

export default AddTalukaForm;
