// src/models/Comment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  entryId: mongoose.Types.ObjectId | string;
  author: mongoose.Types.ObjectId | string;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  entryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'BlogEntry', 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.model<IComment>('Comment', CommentSchema);