import Hotel from "../models/Hotel.js";
import HotelDetails from "../models/HotelDetails.js";
import mongoose from "mongoose";
import transporter from "../config/nodemailer.js";
import userModel from "../models/userModel.js";

// ✅ Submit a new hotel request
export const submitHotel = async (req, res) => {
  try {
    console.log("🔹 Incoming request body:", req.body);

    const {
      hotelName,
      ownerName,
      email,
      phone,
      address,
      description,
      website,
      nearbyAttractions,
      paymentDetails,
      roomsAvailable,
      roomTypes,
      prices,
      amenities,
      paymentOptions,
      hotelRegistrationDocument,
      additionalDocuments,
      images,
    } = req.body;

    // ✅ Required Fields Check
    if (!hotelName || !ownerName || !email || !phone || !address) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // ✅ Parse and validate array fields
    const parsedRoomTypes = parseArrayField(roomTypes);
    const parsedAmenities = parseArrayField(amenities);
    const parsedPaymentOptions = parseArrayField(paymentOptions);
    const parsedAdditionalDocuments = parseArrayField(additionalDocuments);
    const parsedImages = parseArrayField(images);

    // ✅ Parse and validate object fields
    const parsedRoomsAvailable = parseObjectField(roomsAvailable);
    const parsedPrices = parseObjectField(prices);
    const parsedPaymentDetails = parseObjectField(paymentDetails);

    // ✅ Parse `nearbyAttractions` as an array
    const parsedNearbyAttractions = parseArrayField(nearbyAttractions);

    // ✅ Debugging Logs
    console.log("📌 Processed Data:");
    console.log("Rooms Available:", parsedRoomsAvailable);
    console.log("Room Types:", parsedRoomTypes);
    console.log("Prices:", parsedPrices);
    console.log("Amenities:", parsedAmenities);
    console.log("Payment Options:", parsedPaymentOptions);
    console.log("Nearby Attractions:", parsedNearbyAttractions);
    console.log("Payment Details:", parsedPaymentDetails);
    console.log("Hotel Registration Document:", hotelRegistrationDocument);
    console.log("Additional Documents:", parsedAdditionalDocuments);
    console.log("Images:", parsedImages);

    // ✅ Create Hotel Object
    const hotel = new Hotel({
      hotelName,
      ownerName,
      email,
      phone,
      address,
      description,
      website,
      roomsAvailable: parsedRoomsAvailable,
      roomTypes: parsedRoomTypes,
      prices: parsedPrices,
      amenities: parsedAmenities,
      nearbyAttractions: parsedNearbyAttractions,
      hotelRegistrationDocument, // Directly use the URL from the request body
      additionalDocuments: parsedAdditionalDocuments, // Directly use the array of URLs
      images: parsedImages, // Directly use the array of image URLs
      paymentOptions: parsedPaymentOptions,
      paymentDetails: parsedPaymentDetails,
      status: "Pending",
    });

    // ✅ Save hotel request to DB
    await hotel.save();
    res
      .status(201)
      .json({ message: "Hotel submitted successfully!", data: hotel });
  } catch (error) {
    console.error("❌ Error submitting hotel:", error.message);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed.", error: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to submit the hotel.", error: error.message });
  }
};

// Helper function to parse array fields
const parseArrayField = (field) => {
  try {
    if (typeof field === "string") {
      return JSON.parse(field);
    }
    return Array.isArray(field) ? field : [];
  } catch (error) {
    return [];
  }
};

// Helper function to parse object fields
const parseObjectField = (field) => {
  try {
    if (typeof field === "string") {
      return JSON.parse(field);
    }
    return typeof field === "object" && !Array.isArray(field) ? field : {};
  } catch (error) {
    return {};
  }
};
export const approveHotel = async (req, res) => {
  console.log("Request received", req.body);

  try {
    const { hotelId, email } = req.body;

    if (!hotelId || !email) {
      return res
        .status(400)
        .json({ message: "Hotel ID and email are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: "Invalid Hotel ID format." });
    }

    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { status: "Approved" },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    console.log("Hotel found and updated:", hotel);

    if (!hotel.email) {
      console.error("❌ Hotel email missing");
      return res
        .status(500)
        .json({ message: "Hotel owner email is not available." });
    }

    // ✅ Save to HotelDetails only if not already present
    const exists = await HotelDetails.findById(hotelId);
    if (!exists) {
      const newHotelDetails = new HotelDetails({
        _id: hotelId,
        hotelName: hotel.hotelName,
        email: hotel.email,
        rooms: [], // initialize empty rooms array
      });

      try {
        await newHotelDetails.save();
        console.log("✅ HotelDetails saved successfully");
      } catch (err) {
        console.error("❌ Error saving HotelDetails:", err.message);
        return res.status(500).json({
          message: "Failed to save hotel details.",
          error: err.message,
        });
      }
    } else {
      console.log("ℹ️ HotelDetails already exists, skipping insert.");
    }

    // ✅ Update user's role to "hotelier"
    const updatedUser = await userModel.findOneAndUpdate(
      { email: hotel.email },
      { role: "hotelier" },
      { new: true }
    );

    if (!updatedUser) {
      console.warn("⚠️ User not found for role update.");
    } else {
      console.log("✅ User role updated to hotelier:", updatedUser.email);
    }

    // ✅ Send Approval Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: hotel.email,
      subject: "Hotel Approval Notification",
      text: `Dear Hotelier,

Your hotel "${hotel.hotelName}" has been approved and is now listed under the verified hoteliers section.

Thank you for your patience!

Best Regards,
The Team`,
    };

    try {
      const emailResponse = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", emailResponse.response);
    } catch (emailError) {
      console.error("❌ Email send error:", emailError);
      return res.status(500).json({
        message: "Failed to send approval email.",
        error: emailError.message,
      });
    }

    res.json({
      message: "Hotel approved successfully! Data saved and email sent.",
      data: hotel,
    });
  } catch (error) {
    console.error("❌ Error approving hotel:", error);
    res
      .status(500)
      .json({ message: "Failed to approve hotel.", error: error.stack });
  }
};

// ✅ Decline a Hotel

export const declineHotel = async (req, res) => {
  try {
    const { hotelId, email, feedback } = req.body;

    if (!hotelId || !email) {
      return res
        .status(400)
        .json({ message: "Hotel ID and email are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: "Invalid Hotel ID format." });
    }

    // Update hotel status to "Declined"
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { status: "Declined" },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    console.log("✅ Hotel status updated to Declined:", hotel.hotelName);

    // Send rejection email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Hotel Verification Rejected",
      text: `Dear ${hotel.ownerName || "Hotelier"},

We regret to inform you that your hotel "${
        hotel.hotelName
      }" has been declined for verification.

Reason: ${feedback || "No reason provided."}

You may revise your details and re-apply again for verification.

Thank you for understanding.

Best regards,  
The GhumnaJaam Team`,
    };

    try {
      const emailResponse = await transporter.sendMail(mailOptions);
      console.log("📨 Rejection email sent:", emailResponse.response);
    } catch (emailErr) {
      console.error("❌ Error sending rejection email:", emailErr.message);
      return res.status(500).json({
        message: "Hotel declined but failed to send email.",
        error: emailErr.message,
      });
    }

    res.json({
      message: "Hotel declined successfully and email sent.",
      data: hotel,
    });
  } catch (error) {
    console.error("❌ Error declining hotel:", error.message);
    res.status(500).json({
      message: "Failed to decline hotel.",
      error: error.message,
    });
  }
};

// ✅ Fetch Approved Hotels
export const getApprovedHotels = async (req, res) => {
  try {
    const approvedHotels = await Hotel.find({ status: "Approved" });
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
    const declinedHotels = await Hotel.find({ status: "Declined" });
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
export const getHotelRequests = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    console.error("❌ Error fetching hotel requests:", error);
    res.status(500).json({ message: "Failed to retrieve hotel requests." });
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

export const revertHotelierToPending = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Find and update the hotel status back to "Pending"
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { status: "Pending" },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotelier not found" });
    }

    // Revert the user's role to "user"
    const updatedUser = await userModel.findOneAndUpdate(
      { email: hotel.email },
      { role: "user" },
      { new: true }
    );

    if (!updatedUser) {
      console.warn("⚠️ User not found for role revert.");
    } else {
      console.log("✅ User role reverted to user:", updatedUser.email);
    }

    res.json({
      message: "Hotelier status reverted to Pending and role reverted to user!",
      data: hotel,
    });
  } catch (error) {
    console.error("❌ Error updating hotelier status:", error.message);
    res.status(500).json({
      message: "Failed to update hotelier status.",
      error: error.message,
    });
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
