import mongoose, { Schema, model, Document } from 'mongoose'


export interface INotes extends Document {
  title: string;
  subTitle: string;
  noteImage: string;
  tags: string;
  content: string;
  noteShare: boolean;
  owner: mongoose.Schema.Types.ObjectId;
};

const notesSchema = new Schema<INotes>(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    noteImage: {
      type: String,
      default: "notes/default.png",
    },
    tags: {
      type: String,
    },
    content: {
      type: String,
      required: true
    },
    noteShare: {
      type: Boolean,
      default: false,
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  }
  , {
    timestamps: true
  }
);

export default model<INotes>('Notes', notesSchema);