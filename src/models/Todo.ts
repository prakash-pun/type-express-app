import { Schema, model, Document } from "mongoose";

export interface ITodo extends Document {
  text: string;
  isCompleted: boolean;
}

const todoSchema = new Schema<ITodo>(
  {
    text: {
      type: String,
      required: true,
      min: 4,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ITodo>("Todo", todoSchema);
