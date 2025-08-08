"use server";

import dbConnect from "@/lib/dbConnect";
import Task from "@/lib/models/Task";
import { Types } from "mongoose";

export type ProcessedTask = {
  _id: string;
  description: string;
  completed: boolean;
  deadline: string;
  remindBefore1Days: boolean;
  remindBefore3Days: boolean;
  remindBefore7Days: boolean;
};

export async function getTasks(
  userId: string
): Promise<
  { completeTasks: ProcessedTask[]; activeTasks: ProcessedTask[] } | false
> {
  try {
    await dbConnect();

    const tasks = await Task.find({ user: new Types.ObjectId(userId) })
      .sort({ deadline: 1 })
      .lean();

    if (!tasks || tasks.length === 0) {
      return false;
    }

    const processedTasks: ProcessedTask[] = tasks.map((task) => ({
      _id: task._id.toString(),
      description: task.description,
      completed: task.completed,
      deadline: task.deadline.toISOString(),
      remindBefore1Days: task.remindBefore1Days.remind,
      remindBefore3Days: task.remindBefore3Days.remind,
      remindBefore7Days: task.remindBefore7Days.remind,
    }));

    const completeTasks = processedTasks.filter((task) => task.completed);
    const activeTasks = processedTasks.filter((task) => !task.completed);

    return { completeTasks, activeTasks };
  } catch (e) {
    console.error("Database Error: Failed to fetch tasks.", e);
    throw new Error("Failed to fetch tasks.");
  }
}
