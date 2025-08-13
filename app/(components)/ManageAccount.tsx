"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaUser, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { deleteAccount } from "../actions/deleteAccount";

interface AccountManagementProps {
  isOpen: boolean;
  setManageIsOpen: (val: boolean) => void;
  userEmail: string;
}

export default function AccountManagement({
  isOpen,
  setManageIsOpen,
  userEmail,
}: AccountManagementProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteAccount();

      if (result.success) {
        console.log("Account deleted successfully");
        await signOut({ callbackUrl: "/" });
      } else {
        console.error("Failed to delete account:", result.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setManageIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <button
          onClick={() => setManageIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
        >
          <IoMdClose size={24} />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <FaUser className="text-2xl text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Account Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your Deadline Desk account settings.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Account Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <FaUser className="text-sm text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700 mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <FaTrash />
              Delete Account
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
            <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <FaExclamationTriangle className="text-xl text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you absolutely sure? This will permanently delete your
                  account and all your deadlines. This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
