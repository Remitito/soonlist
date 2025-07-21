"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/lib/models/Task";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export type FormState = {
  message: string;
};

type UpdateData = {
  description: string;
  deadline: string;
  remindBefore1Day: boolean;
  remindBefore3Days: boolean;
  remindBefore7Days: boolean;
};

export async function updateTask(
  taskId: string,
  data: UpdateData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Error: Authentication required." };
  }

  console.log("--- DEBUGGING UPDATE TASK ---");
  console.log("1. Received Task ID (from client):", taskId);
  console.log("   Type of Task ID:", typeof taskId);
  console.log("2. Session User ID (from auth):", session.user.id);
  console.log("   Type of User ID:", typeof session.user.id);

  try {
    await dbConnect();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: data },
      { new: true }
    );

    if (!task) {
      return {
        message:
          "Error: Task not found or you do not have permission to edit it.",
      };
    }
  } catch (e) {
    console.error(e);
    return { message: "Database Error: Failed to update task." };
  }

  revalidatePath("/");

  return { message: "Success! Task updated." };
}
