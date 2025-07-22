"use client";

import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface DecisionPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DecisionPopup: React.FC<DecisionPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0  flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full">
            <FaExclamationTriangle className="text-red-500 h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Confirmation Required
          </h3>
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionPopup;
