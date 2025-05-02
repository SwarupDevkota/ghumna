import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    amenities: {
      type: [String],
      default: [],
    },
    nearbyAttractions: {
      type: [String],
      default: [],
    },
    registrationDocument: { type: String },
    additionalDocuments: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    roomTypes: {
      type: [String],
      default: [],
    },

    rejectionFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
export default Hotel;
