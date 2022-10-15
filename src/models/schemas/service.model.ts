import * as mongoose from "mongoose";

// Service Schema
export const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  media: {
    type: String,
    required: true
  },
  durationStarting: {
    type: Number,
    required: true
  },
  durationEnding: {
    type: Number,
    required: true
  },
  businessId: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export interface ServiceModel extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  media: string;
  durationStarting: number;
  durationEnding: number;
  businessId: number;
}