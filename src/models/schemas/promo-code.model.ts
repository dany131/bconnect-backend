import * as mongoose from "mongoose";


export const PromoCodeSchema = new mongoose.Schema({
  businessId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDateTime: {
    type: String,
    required: true
  },
  endDateTime: {
    type: String,
    required: true
  },
  discount: {           // In percent
    type: String,
    required: true
  }
}, { timestamps: true });

export interface PromoCodeModel extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  businessId: number;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  discount: string;
}