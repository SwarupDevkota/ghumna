// controllers/booking.controller.js
import bookingModel from "../models/booking.model.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "hotel",
      "user",
      "rooms",
      "checkInDate",
      "checkOutDate",
      "numberOfGuests",
      "totalPrice",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check if rooms are available (you'll need to implement this)
    // const isAvailable = await checkRoomAvailability(req.body.rooms, req.body.checkInDate, req.body.checkOutDate);
    // if (!isAvailable) {
    //   return res.status(400).json({ message: "Room not available for selected dates" });
    // }

    const newBooking = await bookingModel.create({
      ...req.body,
      paymentStatus: req.body.paymentStatus || "Completed",
    });

    console.log("✅ New Booking Saved:", newBooking);

    // Update the user's applications field with the new booking ID
    await userModel.findByIdAndUpdate(
      req.body.user, // The user ID from the request
      {
        $push: {
          applications: newBooking._id,
        },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user and populate the applications with all necessary data
    const user = await userModel
      .findById(userId)
      .populate({
        path: "applications",
        populate: [
          {
            path: "hotel",
            select: "name address contact description images", // Select only necessary hotel fields
          },
          {
            path: "rooms",
            select: "type price maxGuests description images", // Select only necessary room fields
          },
        ],
      })
      .select("applications"); // Only return applications field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User applications fetched successfully",
      applications: user.applications,
    });
  } catch (error) {
    console.error("❌ Error fetching user applications:", error);
    res.status(500).json({
      message: "Failed to fetch user applications",
      error: error.message,
    });
  }
};

export const getBookingsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Validate hotelId
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel ID" });
    }

    const bookings = await bookingModel
      .find({ hotel: hotelId })
      .populate({
        path: "user",
        select: "name email phone", // Select only the fields you need
      })
      .populate({
        path: "rooms",
        select: "type price maxGuests description", // Select only the fields you need
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this hotel" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const allBookings = await bookingModel
      .find({})
      .populate({
        path: "user",
        select: "name email phone", // Select only the fields you need
      })
      .populate({
        path: "rooms",
        select: "type price maxGuests description", // Select only the fields you need
      })
      .sort({ createdAt: -1 }); // Sort by newest first;

    res.status(200).json({ allBookings });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
