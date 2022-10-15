import * as mongoose from "mongoose";
import { ProfessionalScheduleInterface } from "../interfaces";

// Professional Schema
export const ProfessionalSchema = new mongoose.Schema({
  businessId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  media: {
    type: String,
    required: true
  },
  services: [mongoose.Schema.Types.ObjectId],
  schedule: [
    {
      day: { type: String, required: true },
      type: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }]

}, { timestamps: true });

export interface ProfessionalModel extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  businessId: number;
  name: string;
  media: string;
  services: [mongoose.Schema.Types.ObjectId];
  schedule: ProfessionalScheduleInterface[];

}
