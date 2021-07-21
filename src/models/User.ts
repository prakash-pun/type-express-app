import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    firstName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: false
    },
    userName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema)