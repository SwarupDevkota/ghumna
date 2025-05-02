import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomCount: {
    type: String,
    required: [true, "Room Count is required"],
  },
  type: {
    type: String,
    required: [true, "Room type is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  maxGuests: {
    type: Number,
    required: [true, "Max guests is required"],
    min: [1, "Max guests must be at least 1"],
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  images: [
    {
      type: String,
      trim: true,
    },
  ],
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "Hotel ID is required"],
  },
});

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);
export default Room;
