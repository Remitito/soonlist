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
  remindBefore1Days: boolean;
  remindBefore3Days: boolean;
  remindBefore7Days: boolean;
  completed: boolean;
};

export async function updateTask(
  taskId: string,
  data: UpdateData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Error: Authentication required." };
  }

  try {
    await dbConnect();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const currentTask = await Task.findOne({ _id: taskId, user: userId });

    if (!currentTask) {
      return {
        message:
          "Error: Task not found or you do not have permission to edit it.",
      };
    }

    const updateData = {
      description: data.description,
      deadline: data.deadline,
      completed: data.completed,
      remindBefore1Day: {
        remind: data.remindBefore1Days,
        // Reset 'done' only if user is enabling a reminder that was previously disabled
        done:
          data.remindBefore1Days && !currentTask.remindBefore1Days.remind
            ? false
            : currentTask.remindBefore1Days.done,
      },
      remindBefore3Days: {
        remind: data.remindBefore3Days,
        done:
          data.remindBefore3Days && !currentTask.remindBefore3Days.remind
            ? false
            : currentTask.remindBefore3Days.done,
      },
      remindBefore7Days: {
        remind: data.remindBefore7Days,
        done:
          data.remindBefore7Days && !currentTask.remindBefore7Days.remind
            ? false
            : currentTask.remindBefore7Days.done,
      },
    };

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: updateData },
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
