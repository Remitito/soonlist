"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { sendMagicLink } from "../actions/magicLinks";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleMagicLinkSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    const result = await sendMagicLink(email);

    if (result.success) {
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
        >
          <IoMdClose size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome to Soonlist
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your simple deadline list.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-800 transition hover:bg-gray-50"
          >
            <FcGoogle size={22} />
            <span>Sign in with Google</span>
          </button>

          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-xs font-medium text-gray-500">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
            <input
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              {isSubmitting ? "Sending..." : "Send Magic Link"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm font-medium text-green-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
