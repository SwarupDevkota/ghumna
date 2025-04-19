import HotelDetails from "../models/HotelDetails.js";
import transporter from "../config/nodemailer.js";

// ✅ Controller to add a room to an existing hotel
export const addRoomToHotel = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging: Log the request body

    const {
      roomCount,
      type,
      status,
      price,
      guests,
      description,
      image,
      email,
    } = req.body;

    // ✅ Validate required fields
    if (
      !roomCount ||
      !type ||
      !status ||
      !price ||
      !guests ||
      !description ||
      !image ||
      !email
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required, including 'image'." });
    }

    // ✅ Find hotel by email
    const hotel = await HotelDetails.findOne({ email });

    if (!hotel) {
      return res
        .status(404)
        .json({ message: "Hotel not found for this email." });
    }

    // ✅ Create new room object
    const newRoom = {
      roomCount, // Updated from roomNumber
      type,
      status,
      price: parseInt(price, 10), // Convert to number
      maxGuests: parseInt(guests, 10), // Convert to number
      description,
      image, // Storing Cloudinary URL
    };

    // ✅ Add new room to the hotel's rooms array
    hotel.rooms.push(newRoom);

    // ✅ Save the updated hotel document
    await hotel.save();

    res.status(201).json({ message: "Room added successfully!", hotel });
  } catch (error) {
    console.error("❌ Error adding room:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getHotelDetailsById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ message: "Hotel ID is required." });
    }

    // Fetch hotel details using `_id` as a string instead of ObjectId
    const hotelDetails = await HotelDetails.findOne({ _id: id });

    if (!hotelDetails) {
      return res.status(404).json({ message: "Hotel details not found." });
    }

    return res.status(200).json(hotelDetails);
  } catch (err) {
    console.error("❌ Error fetching hotel details:", err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getRoomDetails = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const hotel = await HotelDetails.findOne({ email });

    if (!hotel) {
      return res
        .status(404)
        .json({ message: "No hotel found with this email." });
    }

    res.status(200).json({ rooms: hotel.rooms });
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to handle availability form submission
export const checkHotelAvailability = async (req, res) => {
  try {
    const { hotelId, email, phone, guests, company, rooms, criteria } =
      req.body;

    // Validate input data
    if (!hotelId || !email || !phone || !guests || !rooms) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the hotel by ID
    const hotel = await HotelDetails.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Construct the availability form entry
    const availabilityEntry = {
      email,
      phone,
      guests: Number(guests),
      company: company || "",
      roomsNeeded: Number(rooms),
      criteria: criteria || "",
    };

    // Save the availability request in the hotel's availabilityForm array
    hotel.availabilityForm.push(availabilityEntry);
    await hotel.save();

    return res
      .status(201)
      .json({ message: "Availability request submitted successfully" });
  } catch (error) {
    console.error("Error processing availability form:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailabilityDetails = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const hotel = await HotelDetails.findOne({ email });

    if (!hotel) {
      return res
        .status(404)
        .json({ message: "No forms found with this email." });
    }

    res.status(200).json({ availabilityForm: hotel.availabilityForm });
  } catch (error) {
    console.error("Error fetching availability form:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptAvailabilityRequest = async (req, res) => {
  try {
    const { id, feedback } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    const hotel = await HotelDetails.findOne({ "availabilityForm._id": id });
    if (!hotel) return res.status(404).json({ message: "Request not found" });

    const form = hotel.availabilityForm.id(id);
    form.status = "approved";
    await hotel.save();
    console.log(form.email);
    // Send email
    await transporter.sendMail({
      from: '"Hotel Admin" <your-email@example.com>',
      to: form.email,
      subject: "✅ Your Availability Request has been Approved",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2e7d32;">Your Reservation Request has been Approved ✅</h2>
        <p>Dear Guest,</p>
        <p>We are pleased to inform you that your availability request has been <strong>approved</strong>.</p>
        
        <h4>Admin Feedback:</h4>
        <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px;">${
          feedback || "No feedback provided."
        }</p>
        
        <p>Our team will contact you shortly with further details.</p>
        <br/>
        <p>Thank you for choosing us!</p>
        <p>Warm Regards,<br/>Hotel Management Team</p>
    </div>
    `,
    });

    return res.json({ message: "Request approved & email sent." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const rejectAvailabilityRequest = async (req, res) => {
  try {
    const { id, feedback } = req.body;
    if (!id) return res.status(400).json({ message: "ID is required" });

    const hotel = await HotelDetails.findOne({ "availabilityForm._id": id });
    if (!hotel) return res.status(404).json({ message: "Request not found" });

    const form = hotel.availabilityForm.id(id);
    form.status = "rejected";
    await hotel.save();

    // Send email
    await transporter.sendMail({
      from: '"Hotel Admin" <your-email@example.com>',
      to: form.email,
      subject: "⚠️ Your Availability Request has been Rejected",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #c62828;">Your Reservation Request has been Rejected ❌</h2>
        <p>Dear Guest,</p>
        <p>We regret to inform you that your availability request has been <strong>rejected</strong>.</p>
        
        <h4>Admin Feedback:</h4>
        <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px;">${
          feedback || "No feedback provided."
        }</p>
        
        <p>Please feel free to contact us if you have any questions or require further assistance.</p>
        <br/>
        <p>We hope to serve you better in the future.</p>
        <p>Best Regards,<br/>Hotel Management Team</p>
    </div>
    `,
    });

    return res.json({ message: "Request rejected & email sent." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
