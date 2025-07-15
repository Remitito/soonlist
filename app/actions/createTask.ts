"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Task from "@/lib/models/Task";
import { revalidatePath } from "next/cache";

export type FormState = {
  message: string;
  errors?: {
    description?: string[];
    deadline?: string[];
  };
};

export async function createTask(formData: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: "Error: You must be logged in to create a task." };
  }

  const rawData = Object.fromEntries(formData.entries());
  const taskData = {
    description: rawData.description as string,
    deadline: new Date(rawData.deadline as string),
    remindBefore1Day: rawData.remindBefore1Day === "on",
    remindBefore3Days: rawData.remindBefore3Days === "on",
    remindBefore7Days: rawData.remindBefore7Days === "on",
    user: session.user.id,
    completed: false,
  };
  try {
    await dbConnect();
    await Task.create(taskData);
  } catch (e) {
    console.error(e);
    return { message: "Database Error: Failed to create task." };
  }

  revalidatePath("/");

  return { message: "Success! Task created." };
}
