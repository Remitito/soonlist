"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/lib/models/Task";
import { revalidatePath } from "next/cache";
import { FormState } from "./updateTask";

export async function deleteTask(taskId: string): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Error: Authentication required." };
  }

  try {
    await dbConnect();

    const result = await Task.findOneAndDelete({
      _id: taskId,
      user: session.user.id,
    });

    if (!result) {
      return {
        message:
          "Error: Task not found or you do not have permission to delete it.",
      };
    }
  } catch (e) {
    console.error(e);
    return { message: "Database Error: Failed to delete task." };
  }

  revalidatePath("/");

  return { message: "Success! Task deleted." };
}
