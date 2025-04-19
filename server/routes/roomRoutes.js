import express from "express";
import upload from "../config/multer.js";
import {
  addRoomToHotel,
  getHotelDetailsById,
  getRoomDetails,
  checkHotelAvailability,
  getAvailabilityDetails,
  acceptAvailabilityRequest,
  rejectAvailabilityRequest,
} from "../controllers/roomController.js";

const router = express.Router();

// ✅ Define route for adding a room
router.post("/rooms", upload, addRoomToHotel);
router.get("/room-details", getHotelDetailsById);
router.post("/room-details", getRoomDetails);
router.post("/hotel-availability", checkHotelAvailability);
router.post("/availability-details", getAvailabilityDetails);
router.post("/availability-details/approved", acceptAvailabilityRequest);
router.post("/availability-details/rejected", rejectAvailabilityRequest);
export default router;
