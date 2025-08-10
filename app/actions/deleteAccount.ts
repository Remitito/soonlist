"use server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
export async function deleteAccount() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, message: "Not authenticated" };
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    await Task.deleteMany({ user: user._id });
    await User.deleteOne({ _id: user._id });

    return {
      success: true,
      message: "Account and all associated data deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    return {
      success: false,
      message: "Failed to delete account. Please try again.",
    };
  }
}
