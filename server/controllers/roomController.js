import Room from "../models/room.model.js";
import { AvailabilityRequest } from "../models/availabilityRequest.model.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// controllers/roomController.js

export const createRoom = async (req, res) => {
  try {
    // Since FormData is sent, parse the body manually if needed
    // For FormData, express.json() won't parse it, so we rely on req.body
    const { roomCount, type, price, maxGuests, description, image, hotelId } =
      req.body;

    // Log received data for debugging
    console.log("Received data for createRoom:", {
      roomCount,
      type,
      price,
      maxGuests,
      description,
      image,
      hotelId,
    });

    // Validate required fields
    if (!roomCount || !type || !price || !maxGuests || !hotelId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new room
    const newRoom = new Room({
      roomCount,
      type,
      price: parseFloat(price), // Convert string to number
      maxGuests: parseInt(maxGuests), // Convert string to number
      description: description || "", // Optional description
      images: image ? [image] : [], // Store the image URL in images array
      hotel: hotelId,
    });

    await newRoom.save();
    console.log("Room created successfully:", newRoom);
    res.status(201).json({ room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all rooms for a specific hotel
export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.query; // Get hotelId from query parameters

    if (!hotelId) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

    const rooms = await Room.find({ hotel: hotelId })
      .populate("hotel", "name email")
      .lean();

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a room
export const updateRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      status,
      price,
      maxGuests,
      description,
      image,
      hotelId,
    } = req.body;

    // Validate required fields
    if (!roomNumber || !type || !price || !maxGuests || !hotelId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find and update the room
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        roomNumber,
        type,
        status,
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests),
        description,
        images: image ? [image] : [],
        hotel: hotelId,
      },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ room: updatedRoom });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: error.message });
  }
};

// Function to handle availability form submission

export const createAvailabilityRequest = async (req, res) => {
  try {
    const {
      hotelId,
      userId,
      phone,
      guests,
      rooms,
      criteria,
      checkIn,
      checkOut,
    } = req.body;

    // Validate required fields
    if (
      !hotelId ||
      !userId ||
      !phone ||
      !guests ||
      !rooms ||
      !checkIn ||
      !checkOut
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Create new availability request
    const newRequest = new AvailabilityRequest({
      user: new mongoose.Types.ObjectId(userId),
      hotel: new mongoose.Types.ObjectId(hotelId),
      phone,
      guests: parseInt(guests),
      roomsNeeded: parseInt(rooms),
      checkInDate,
      checkOutDate,
      criteria,
      status: "Completed",
    });

    // Save to database
    const savedRequest = await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Availability request submitted successfully",
      data: savedRequest,
    });
  } catch (error) {
    console.error("Error creating availability request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Controller to fetch availability requests for a specific hotel with user data
export const getHotelAvailabilityRequests = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Validate hotelId
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID",
      });
    }

    // Fetch requests with user data populated
    const requests = await AvailabilityRequest.find({ hotel: hotelId })
      .populate({
        path: "user",
        select: "name email image", // Include other user fields you need
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!requests || requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No availability requests found for this hotel",
      });
    }

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching hotel availability requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Approve Availability Request
export const approveAvailabilityRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the availability request and populate hotel details
    const availabilityRequest = await AvailabilityRequest.findById(id).populate(
      "hotel"
    );
    if (!availabilityRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Availability request not found" });
    }

    // Check if the request is already processed
    if (availabilityRequest.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    // Update the status to Approved
    availabilityRequest.status = "Approved";
    await availabilityRequest.save();

    // Add the availability request ID to the user's availabilityRequests array
    const user = await User.findById(availabilityRequest.user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.availabilityRequests.push(availabilityRequest._id);
    await user.save();

    // Send approval email to the user
    const mailOptions = {
      from: `"GhumnaJaam" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Your Availability Request Has Been Approved",
      html: `
        <h2>Availability Request Approved</h2>
        <p>Dear ${user.name},</p>
        <p>We are pleased to inform you that your availability request for <strong>${
          availabilityRequest.hotel.name
        }</strong> has been approved.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Check-In Date:</strong> ${new Date(
            availabilityRequest.checkInDate
          ).toLocaleDateString()}</li>
          <li><strong>Check-Out Date:</strong> ${new Date(
            availabilityRequest.checkOutDate
          ).toLocaleDateString()}</li>
          <li><strong>Guests:</strong> ${availabilityRequest.guests}</li>
          <li><strong>Rooms Needed:</strong> ${
            availabilityRequest.roomsNeeded
          }</li>
        </ul>
        <p>Please contact the hotel for further booking confirmation.</p>
        <p>Thank you for choosing our service!</p>
        <p>Best regards,<br/>Hotel Booking System Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${user.email}`);

    return res.status(200).json({
      success: true,
      data: availabilityRequest,
      message: "Availability request approved successfully",
    });
  } catch (error) {
    console.error("❌ Approve error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to approve request" });
  }
};

// Reject Availability Request
export const rejectAvailabilityRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the availability request and populate hotel details
    const availabilityRequest = await AvailabilityRequest.findById(id).populate(
      "hotel"
    );
    if (!availabilityRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Availability request not found" });
    }

    // Check if the request is already processed
    if (availabilityRequest.status !== "Compeleted") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    // Update the status to Rejected
    availabilityRequest.status = "Rejected";
    await availabilityRequest.save();

    // Find the user to get their email
    const user = await User.findById(availabilityRequest.user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send rejection email to the user
    const mailOptions = {
      from: `"GhumnaJaam" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Your Availability Request Has Been Rejected",
      html: `
        <h2>Availability Request Rejected</h2>
        <p>Dear ${user.name},</p>
        <p>We regret to inform you that your availability request for <strong>${
          availabilityRequest.hotel.name
        }</strong> has been rejected.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Check-In Date:</strong> ${new Date(
            availabilityRequest.checkInDate
          ).toLocaleDateString()}</li>
          <li><strong>Check-Out Date:</strong> ${new Date(
            availabilityRequest.checkOutDate
          ).toLocaleDateString()}</li>
          <li><strong>Guests:</strong> ${availabilityRequest.guests}</li>
          <li><strong>Rooms Needed:</strong> ${
            availabilityRequest.roomsNeeded
          }</li>
        </ul>
        <p>Please contact our support team if you have any questions or need assistance with another request.</p>
        <p>Thank you for choosing our service!</p>
        <p>Best regards,<br/>Hotel Booking System Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${user.email}`);

    return res.status(200).json({
      success: true,
      data: availabilityRequest,
      message: "Availability request rejected successfully",
    });
  } catch (error) {
    console.error("❌ Reject error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to reject request" });
  }
};

export const getUserAvailabilityRequests = async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  try {
    const availabilityRequests = await AvailabilityRequest.find({
      user: userId,
    })
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "hotel",
        select: "name address",
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!availabilityRequests || availabilityRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No availability requests found for this user",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Availability requests fetched successfully",
      data: availabilityRequests,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error fetching availability requests: ${error.message}`);
  }
};
