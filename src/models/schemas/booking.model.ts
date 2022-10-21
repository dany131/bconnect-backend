import * as mongoose from "mongoose";


export const BookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  businessId: {
    type: Number,
    required: true
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  startDateTime: {        // UTC - ISO format
    type: String,
    required: true
  },
  endDateTime: {          // UTC - ISO format
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  timezone: {
    type: String
  }
}, { timestamps: true });

export interface BookingModel extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  customerId: mongoose.Schema.Types.ObjectId;
  businessId: number;
  professionalId: mongoose.Schema.Types.ObjectId;
  service: mongoose.Schema.Types.ObjectId;
  startDateTime: string;
  endDateTime: string;
  status: string;
  timezone: string;
}