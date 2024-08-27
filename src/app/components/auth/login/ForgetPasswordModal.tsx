import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { showToast } from "@/app/Utils/Utils";

interface ForgetPasswordModalType {
  isOpen: boolean;
  onClose: () => void;
}

const ForgetPasswordModal = ({ isOpen, onClose }: ForgetPasswordModalType) => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent successfully!", "s");
      onClose();
    } catch (err: any) {
      showToast(err.message ?? "Something is wrong!", "e");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Enter your email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
