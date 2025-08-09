import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task, { ITask } from "@/lib/models/Task";
import { getDaysUntilDeadline } from "@/app/utils/DateStuff";
import "@/lib/models/User";
import { sendEmail } from "@/app/utils/Email";

interface TaskReminderInfo {
  id: string;
  user: string;
  email: string;
  userId: string;
  description: string;
  daysUntil: number;
  dueReminders: string[];
}

export async function GET() {
  await dbConnect();

  const tasks = await Task.find({
    completed: false,
    $or: [
      { "remindBefore1Days.remind": true, "remindBefore1Days.done": false },
      { "remindBefore3Days.remind": true, "remindBefore3Days.done": false },
      { "remindBefore7Days.remind": true, "remindBefore7Days.done": false },
    ],
  }).populate({ path: "user", select: "name email" });

  const tasksDueForReminder: TaskReminderInfo[] = [];
  const tasksNotDueForReminder: TaskReminderInfo[] = [];
  const updatedTasks: ITask[] = [];

  for (const task of tasks as ITask[]) {
    const daysUntil = getDaysUntilDeadline(task.deadline);
    const dueReminders: string[] = [];
    const updateFields: Record<string, unknown> = {};

    if (
      task.remindBefore1Days?.remind &&
      !task.remindBefore1Days?.done &&
      daysUntil <= 1
    ) {
      dueReminders.push("1 Day");
      updateFields["remindBefore1Days.done"] = true;
    }

    if (
      task.remindBefore3Days?.remind &&
      !task.remindBefore3Days?.done &&
      daysUntil <= 3
    ) {
      dueReminders.push("3 Days");
      updateFields["remindBefore3Days.done"] = true;
    }

    if (
      task.remindBefore7Days?.remind &&
      !task.remindBefore7Days?.done &&
      daysUntil <= 7
    ) {
      dueReminders.push("7 Days");
      updateFields["remindBefore7Days.done"] = true;
    }

    const userObj = task.user as unknown as {
      _id: string;
      name: string;
      email: string;
    };

    const taskInfo: TaskReminderInfo = {
      id: (task._id as { toString: () => string }).toString(),
      user: userObj?.name ?? "Unknown",
      email: userObj?.email ?? "unknown@example.com",
      userId: userObj?._id?.toString() ?? "",
      description: task.description,
      daysUntil,
      dueReminders,
    };

    if (dueReminders.length > 0) {
      tasksDueForReminder.push(taskInfo);

      try {
        await Task.findByIdAndUpdate(task._id, { $set: updateFields });
        updatedTasks.push(task);
        console.log(
          `✅ Updated task "${
            task.description
          }" - marked reminders as done: [${dueReminders.join(", ")}]`
        );
      } catch (error) {
        console.error(`❌ Failed to update task "${task.description}":`, error);
      }
    } else {
      tasksNotDueForReminder.push(taskInfo);
    }
  }

  // Group tasks by user for emailing
  const grouped: Record<
    string,
    {
      name: string;
      email: string;
      tasks: { description: string; daysUntil: number }[];
    }
  > = {};

  for (const task of tasksDueForReminder) {
    const { userId, user, email, description, daysUntil } = task;
    if (!grouped[userId]) {
      grouped[userId] = { name: user, email, tasks: [] };
    }
    grouped[userId].tasks.push({ description, daysUntil });
  }

  for (const userId in grouped) {
    const { name, email, tasks } = grouped[userId];
    await sendEmail(name, email, tasks);
  }

  console.log(`\nTotal tasks checked: ${tasks.length}`);
  console.log(`Tasks due for reminders: ${tasksDueForReminder.length}`);
  console.log(`Tasks not due for reminders: ${tasksNotDueForReminder.length}`);
  console.log(`Tasks updated in database: ${updatedTasks.length}`);

  return NextResponse.json({
    message: "Processed reminder tasks and (optionally) sent emails.",
    tasksChecked: tasks.length,
    tasksDueForReminder: tasksDueForReminder.length,
    tasksNotDueForReminder: tasksNotDueForReminder.length,
    tasksUpdated: updatedTasks.length,
  });
}
