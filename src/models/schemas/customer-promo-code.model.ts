import * as mongoose from "mongoose";


export const CustomerPromoCodeSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  promoCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  businessId: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export interface CustomerPromoCodeModel extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  customerId: mongoose.Schema.Types.ObjectId;
  promoCodeId: mongoose.Schema.Types.ObjectId;
  businessId: number;
}