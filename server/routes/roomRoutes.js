import express from "express";
import {
  createRoom,
  getRoomsByHotel,
  updateRoom,
  deleteRoom,
  createAvailabilityRequest,
  getHotelAvailabilityRequests,
  approveAvailabilityRequest,
  rejectAvailabilityRequest,
  getUserAvailabilityRequests,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getRoomsByHotel);
// ✅ Define route for adding a room
router.post("/add", createRoom);

// Update a room
router.post("/update/:id", updateRoom);

// Delete a room
router.delete("/:id", deleteRoom);

router.post("/hotel-availability", createAvailabilityRequest);
router.get("/availability/:hotelId", getHotelAvailabilityRequests);

// Approve availability request
router.put("/availability/:id/approve", approveAvailabilityRequest);

// Reject availability request
router.put("/availability/:id/reject", rejectAvailabilityRequest);

router.get("/availability/user/:userId", getUserAvailabilityRequests);

export default router;
