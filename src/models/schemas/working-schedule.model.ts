import * as mongoose from "mongoose";
import { ScheduleInterface } from "../interfaces";


export const WorkingScheduleSchema = new mongoose.Schema({
  businessId: {
    type: Number,
    required: true
  },
  schedule: [{
    day: {                        // Monday, Sunday
      type: String,
      required: true
    },
    startTime: {                 //
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

export interface WorkingScheduleModel extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  businessId: number;
  schedule: ScheduleInterface[];
}