"use server";

import dbConnect from "@/lib/dbConnect";
import Task, { ITask } from "@/lib/models/Task";
import { Types } from "mongoose";

export type ProcessedTask = Omit<ITask, "user" | "_id" | "__v">;

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

    return tasks as ProcessedTask[];
  } catch (e) {
    console.error("Database Error: Failed to fetch tasks.", e);
    throw new Error("Failed to fetch tasks.");
  }
}
