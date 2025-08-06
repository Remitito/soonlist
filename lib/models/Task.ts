import mongoose, { Document, Schema, Model } from "mongoose";

export interface IReminderSetting {
  remind: boolean;
  done: boolean;
}

export interface ITask extends Document {
  description: string;
  completed: boolean;
  deadline: Date;
  remindBefore1Days: IReminderSetting;
  remindBefore3Days: IReminderSetting;
  remindBefore7Days: IReminderSetting;
  user: mongoose.Schema.Types.ObjectId;
}

const reminderSchema = new Schema<IReminderSetting>(
  {
    remind: {
      type: Boolean,
      default: false,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

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
    remindBefore1Days: {
      type: reminderSchema,
      default: { remind: false, done: false },
    },
    remindBefore3Days: {
      type: reminderSchema,
      default: { remind: false, done: false },
    },
    remindBefore7Days: {
      type: reminderSchema,
      default: { remind: false, done: false },
    },
  },
  {
    timestamps: true,
  }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
