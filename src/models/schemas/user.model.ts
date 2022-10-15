import * as mongoose from "mongoose";

// User Schema
export const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    required: true
  },
  businessId: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export interface UserModel extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture: string;
  businessId: number;
}