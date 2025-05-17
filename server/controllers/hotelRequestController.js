import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";
import transporter from "../config/nodemailer.js";
import User from "../models/userModel.js";

import { validationResult } from "express-validator";

// Submit a new hotel
export const submitHotel = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      owner,
      email,
      phone,
      address,
      description,
      website,
      amenities,
      nearbyAttractions,
      registrationDocument,
      additionalDocuments,
      images,
      roomTypes,
    } = req.body;

    // Create new hotel instance
    const hotel = new Hotel({
      name,
      owner,
      email,
      phone,
      address,
      description,
      website,
      amenities: amenities || [],
      nearbyAttractions: nearbyAttractions || [],
      registrationDocument,
      additionalDocuments: additionalDocuments || [],
      images: images || [],
      roomTypes: roomTypes || [], // Include roomTypes
    });

    // Save hotel to database
    await hotel.save();

    res.status(201).json({
      success: true,
      message: "Hotel submitted successfully",
      data: hotel,
    });
  } catch (error) {
    console.error("Error submitting hotel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit hotel",
      error: error.message,
    });
  }
};

// Controller to approve a hotel
export const approveHotel = async (req, res) => {
  try {
    const { hotelId, email } = req.body;

    // Validate input
    if (!hotelId || !email) {
      return res
        .status(400)
        .json({ message: "Hotel ID and email are required" });
    }

    // Find the hotel
    const hotel = await Hotel.findById(hotelId).populate("owner");
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if hotel is still pending
    if (hotel.status !== "Completed") {
      return res
        .status(400)
        .json({ message: `Hotel is already ${hotel.status}` });
    }

    // Verify the email matches the hotel's email
    if (hotel.email !== email) {
      return res
        .status(400)
        .json({ message: "Email does not match hotel record" });
    }

    // Update hotel status to Approved
    hotel.status = "Approved";
    await hotel.save();

    // Update the owner's role to hotelOwner and add hotel to ownedHotels
    const owner = await User.findById(hotel.owner._id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    owner.role = "hotelier";
    owner.ownedHotels = hotel._id;

    await owner.save();

    return res.status(200).json({ message: "Hotel approved successfully" });
  } catch (error) {
    console.error("Error approving hotel:", error);
    return res
      .status(500)
      .json({ message: "Server error while approving hotel" });
  }
};

// Controller to reject a hotel
export const rejectHotel = async (req, res) => {
  try {
    const { hotelId, email, feedback } = req.body;

    // Validate input
    if (!hotelId || !email) {
      return res
        .status(400)
        .json({ message: "Hotel ID and email are required" });
    }
    if (!feedback || feedback.trim() === "") {
      return res
        .status(400)
        .json({ message: "Feedback is required for rejection" });
    }

    // Find the hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if hotel is still pending
    if (hotel.status !== "Completed") {
      return res
        .status(400)
        .json({ message: `Hotel is already ${hotel.status}` });
    }

    // Verify the email matches the hotel's email
    if (hotel.email !== email) {
      return res
        .status(400)
        .json({ message: "Email does not match hotel record" });
    }

    // Update hotel status to Rejected and store feedback
    hotel.status = "Rejected";
    hotel.rejectionFeedback = feedback;
    await hotel.save();

    return res.status(200).json({ message: "Hotel rejected successfully" });
  } catch (error) {
    console.error("Error rejecting hotel:", error);
    return res
      .status(500)
      .json({ message: "Server error while rejecting hotel" });
  }
};

// ✅ Fetch Approved Hotels
export const getApprovedHotels = async (req, res) => {
  try {
    const approvedHotels = await Hotel.find({ status: "Approved" })
      .populate("owner", "name email")
      .lean();
    res.json({ data: approvedHotels });
  } catch (error) {
    console.error("❌ Error fetching approved hotels:", error.message);
    res.status(500).json({
      message: "Failed to fetch approved hotels.",
      error: error.message,
    });
  }
};

// ✅ Fetch Declined Hotels
export const getDeclinedHotels = async (req, res) => {
  try {
    const declinedHotels = await Hotel.find({ status: "Rejected" })
      .populate("owner", "name email")
      .lean();
    res.json({ data: declinedHotels });
  } catch (error) {
    console.error("❌ Error fetching declined hotels:", error.message);
    res.status(500).json({
      message: "Failed to fetch declined hotels.",
      error: error.message,
    });
  }
};

// ✅ Fetch all hotel requests
// Fetch all hotel requests
export const getAllHotels = async (req, res) => {
  try {
    // Fetch all hotels and populate owner details (only name and email for security)
    const hotels = await Hotel.find()
      .populate("owner", "name email")
      .select("-__v") // Exclude version key
      .lean(); // Convert to plain JavaScript objects for better performance

    res.status(200).json({
      success: true,
      message: "Hotels retrieved successfully",
      data: hotels,
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      error: error.message,
    });
  }
};

export const editHotelier = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const updatedData = req.body;

    const hotel = await Hotel.findByIdAndUpdate(hotelId, updatedData, {
      new: true,
    });

    if (!hotel) return res.status(404).json({ message: "Hotelier not found" });

    res.json({ message: "Hotelier updated successfully!", data: hotel });
  } catch (error) {
    console.error("❌ Error updating hotelier:", error.message);
    res
      .status(500)
      .json({ message: "Failed to update hotelier", error: error.message });
  }
};

export const deleteHotelier = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findByIdAndDelete(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotelier not found" });

    res.json({ message: "Hotelier deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting hotelier:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete hotelier", error: error.message });
  }
};

// ✅ Fetch Selected Hotel by _id
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    res.json({ data: hotel });
  } catch (error) {
    console.error("❌ Error fetching hotel by ID:", error.message);
    res.status(500).json({
      message: "Failed to fetch hotel.",
      error: error.message,
    });
  }
};
