"use server";

import dbConnect from "@/lib/dbConnect";
import Task from "@/lib/models/Task";
import { Types } from "mongoose";

export type ProcessedTask = {
  description: string;
  completed: boolean;
  deadline: string;
  remindBefore1Day: boolean;
  remindBefore3Days: boolean;
  remindBefore7Days: boolean;
};

export async function getTasks(
  userId: string
): Promise<ProcessedTask[] | false> {
  try {
    await dbConnect();

    const tasks = await Task.find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();

    if (!tasks || tasks.length === 0) {
      return false;
    }

    const processedTasks: ProcessedTask[] = tasks.map((task) => ({
      description: task.description,
      completed: task.completed,
      deadline: task.deadline.toISOString(),
      remindBefore1Day: task.remindBefore1Day,
      remindBefore3Days: task.remindBefore3Days,
      remindBefore7Days: task.remindBefore7Days,
    }));

    return processedTasks;
  } catch (e) {
    console.error("Database Error: Failed to fetch tasks.", e);
    throw new Error("Failed to fetch tasks.");
  }
}
