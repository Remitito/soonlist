import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    emailVerified: Date,
    image: String,
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
