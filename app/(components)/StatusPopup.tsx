"use client";

import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface StatusPopupProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  time?: number;
}

const StatusPopup: React.FC<StatusPopupProps> = ({
  message,
  type,
  onClose,
  time,
}) => {
  useEffect(() => {
    const timer = setTimeout(
      () => {
        onClose();
      },
      time ? time : 3000
    );

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isSuccess = type === "success";

  const containerClasses = isSuccess
    ? "bg-green-100 border-green-400 text-green-700"
    : "bg-red-100 border-red-400 text-red-700";

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 mb-4 text-sm border-l-4 rounded-lg shadow-lg ${containerClasses}`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {isSuccess ? (
          <FaCheckCircle className="w-5 h-5" />
        ) : (
          <FaTimesCircle className="w-5 h-5" />
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${
          isSuccess
            ? "hover:bg-green-200 focus:ring-green-400"
            : "hover:bg-red-200 focus:ring-red-400"
        }`}
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default StatusPopup;
