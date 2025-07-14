"use server";

import { signIn } from "@/auth";

export async function sendMagicLink(email: string) {
  try {
    await signIn("email", { email, redirect: false });

    return { success: true, message: "Check your email for a magic link!" };
  } catch (error) {
    console.error("Magic Link Error:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
