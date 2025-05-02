// availabilityRequest.model.js
import mongoose from "mongoose";

const AvailabilityRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  company: { type: String },
  roomsNeeded: { type: Number, required: true },
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  criteria: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

export const AvailabilityRequest =
  mongoose.models.AvailabilityRequest ||
  mongoose.model("AvailabilityRequest", AvailabilityRequestSchema);
