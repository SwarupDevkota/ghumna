// user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["user", "hotelier", "admin"],
      default: "user",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dl1xtwusn/image/upload/v1741366955/profile_gnbqfk.png",
    },
    contact: { type: String },
    address: { type: String },
    description: { type: String },
    ownedHotels: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    availabilityRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AvailabilityRequest",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
