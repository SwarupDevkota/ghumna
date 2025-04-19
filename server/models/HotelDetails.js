import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomCount: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // Room Type (Single, Double, Suite, etc.)
  status: {
    type: String,
    required: true,
    enum: ["Available", "Occupied", "Reserved"],
    default: "Available",
  }, // Room Status
  price: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const AvailabilityFormSchema = new mongoose.Schema({
  email: { type: String, required: true }, // User Email
  phone: { type: String, required: true }, // User Phone Number
  guests: { type: Number, required: true }, // Number of Guests
  company: { type: String }, // Optional Company Name
  roomsNeeded: { type: Number, required: true }, // Number of Rooms Required
  criteria: { type: String }, // Special Criteria or Description
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // Allowed status values
    default: "pending",
  },
});

const HotelDetailsSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Manually provided ID
  hotelName: { type: String, required: true }, // Store hotel name
  email: { type: String, required: true, unique: true }, // Store hotel email
  rooms: [RoomSchema], // Store room details directly instead of using `RoomTypeSchema`
  availabilityForm: [AvailabilityFormSchema], // Store availability form responses
});

const HotelDetails = mongoose.model("HotelDetails", HotelDetailsSchema);

export default HotelDetails;
