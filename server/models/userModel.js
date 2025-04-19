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
    role: { type: String, default: "user" },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dl1xtwusn/image/upload/v1741366955/profile_gnbqfk.png",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const userModel = mongoose.models.user || mongoose.model("users", userSchema);
export default userModel;
