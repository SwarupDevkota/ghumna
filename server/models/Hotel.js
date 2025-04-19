import { Schema, model } from "mongoose";

const hotelSchema = new Schema(
  {
    hotelName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    roomsAvailable: {
      type: Map, // Use a Map to store room types and their availability
      of: Number,
      default: {},
    },
    roomTypes: {
      type: [String], // Array of strings
      default: [],
    },
    prices: {
      type: Map, // Use a Map to store room types and their prices
      of: Number,
      default: {},
    },
    amenities: {
      type: [String], // Array of strings
      default: [],
    },
    nearbyAttractions: { type: [String], required: true },
    hotelRegistrationDocument: { type: String }, // Path to registration document file
    additionalDocuments: {
      type: [String], // Paths to additional documents
      default: [],
    },
    images: {
      type: [String], // Paths to uploaded images
      default: [],
    },
    paymentOptions: {
      type: [String], // Available payment options (e.g., "Khalti", "PhonePay")
      default: [],
    },
    paymentDetails: {
      bankName: { type: String },
      number: { type: String },
      khaltiQrCode: { type: String }, // Path to Khalti QR Code image
      phonePayQrCode: { type: String }, // Path to PhonePay QR Code image
      khaltiBankName: { type: String }, // Additional field for Khalti bank name
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"], // Allowed status values
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = model("Hotel", hotelSchema);
export default Hotel;
