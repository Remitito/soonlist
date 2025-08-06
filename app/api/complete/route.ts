import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/lib/models/Task";

export async function GET(request: Request) {
  const vercelHeader = request.headers.get("x-vercel-cron");
  if (vercelHeader !== "1") {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    await dbConnect();

    const now = new Date();
    const tasksToUpdate = await Task.find({
      completed: false,
      deadline: { $lt: now },
    });

    if (tasksToUpdate.length === 0) {
      return NextResponse.json({ message: "No tasks needed updating." });
    }
    const updateResult = await Task.updateMany(
      {
        completed: false,
        deadline: { $lt: now },
      },
      { $set: { completed: true } }
    );

    return NextResponse.json({
      message: "Tasks updated successfully.",
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating tasks.", error },
      { status: 500 }
    );
  }
}
