// src/models/BlogEntry.ts
import mongoose, { Document, Schema } from 'mongoose';

// Interface für Fußballvorhersagen
interface IPrediction {
  homeTeam: string;
  awayTeam: string;
  predictedScore: string;
  matchDate: Date;
  confidence: number; // 1-5 Sterne
}

interface IImage {
  data: string; // base64 encoded
  caption?: string;
}

interface ILink {
  url: string;
  title: string;
}

export interface IBlogEntry extends Document {
  title: string;
  authors: mongoose.Types.ObjectId[] | string[]; // IDs der User
  description: string;
  creationDate: Date;
  editDates: Date[];
  impressionCount: number;
  content: string;
  commentsAllowed: boolean;
  category: mongoose.Types.ObjectId | string; // ID einer Kategorie
  images: IImage[];
  links: ILink[];
  hashtags: string[];
  predictions: IPrediction[];
}

const BlogEntrySchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true
  },
  authors: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  description: { 
    type: String, 
    required: true 
  },
  creationDate: { 
    type: Date, 
    default: Date.now 
  },
  editDates: [{ 
    type: Date 
  }],
  impressionCount: { 
    type: Number, 
    default: 0 
  },
  content: { 
    type: String, 
    required: true 
  },
  commentsAllowed: { 
    type: Boolean, 
    default: true 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  images: [{
    data: { type: String, required: true }, // base64 encoded
    caption: { type: String }
  }],
  links: [{
    url: { type: String, required: true },
    title: { type: String, required: true }
  }],
  hashtags: [{ 
    type: String 
  }],
  predictions: [{
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    predictedScore: { type: String, required: true },
    matchDate: { type: Date, required: true },
    confidence: { type: Number, min: 1, max: 5, required: true }
  }]
});

// Index für Unique Title + Author Kombination
BlogEntrySchema.index({ title: 1, 'authors.0': 1 }, { unique: true });

export default mongoose.model<IBlogEntry>('BlogEntry', BlogEntrySchema);