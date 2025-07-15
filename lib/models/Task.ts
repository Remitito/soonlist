import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITask extends Document {
  description: string;
  completed: boolean;
  deadline: Date;
  remindBefore1Day: boolean;
  remindBefore3Days: boolean;
  remindBefore7Days: boolean;
  user: mongoose.Schema.Types.ObjectId;
}

const taskSchema: Schema<ITask> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      required: [true, "A deadline is required."],
    },
    // Booleans to indicate if a user wants a reminder N days *before* the deadline
    remindBefore1Day: {
      type: Boolean,
      default: false,
    },
    remindBefore3Days: {
      type: Boolean,
      default: false,
    },
    remindBefore7Days: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
