import mongoose from "mongoose";

// Define the Event schema
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventManager: { type: String, required: true },
  eventOrganization: { type: String, required: true },
  eventDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= new Date(); // Ensure event date is in the future
      },
      message: "Event date cannot be in the past",
    },
  },
  eventDetails: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventImage: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Ensure the model is registered only once
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
