import Event from "../models/Event.js";

export const saveEvent = async (req, res) => {
  try {
    console.log("✅ Received fields:", req.body); // Debugging log

    const {
      eventName,
      eventManager,
      eventOrganization,
      eventDate,
      eventDetails,
      eventLocation,
      eventImage, // This should now be a Cloudinary URL
    } = req.body;

    // Check for missing fields
    if (
      !eventName ||
      !eventManager ||
      !eventOrganization ||
      !eventDate ||
      !eventDetails ||
      !eventLocation ||
      !eventImage // Should be a Cloudinary URL
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Log received image URL (debugging)
    console.log("✅ Received eventImage URL:", eventImage);

    // Save event with Cloudinary image URL
    const newEvent = new Event({
      eventName,
      eventManager,
      eventOrganization,
      eventDate,
      eventDetails,
      eventLocation,
      eventImage, // Store Cloudinary URL directly
      status: "Pending",
    });

    await newEvent.save();
    res.status(201).json({ message: "Event registered successfully!" });
  } catch (error) {
    console.error("❌ Error saving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Approve an event
export const approveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "Approved" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({ message: "Event approved successfully!", data: event });
  } catch (error) {
    console.error("Error approving event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reject an event
export const rejectEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "Declined" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({ message: "Event rejected successfully!", data: event });
  } catch (error) {
    console.error("Error rejecting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all approved events
export const getApprovedEvents = async (req, res) => {
  try {
    const approvedEvents = await Event.find({ status: "Approved" }); // Fetch only approved events
    res.status(200).json(approvedEvents);
  } catch (error) {
    console.error("❌ Error fetching approved events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
