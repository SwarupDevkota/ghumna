// routes/booking.routes.js
import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByHotel,
  getUserApplications,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create a booking
router.post("/book-room", createBooking);
router.get("/applications/:userId", getUserApplications);
router.get("/hotel/:hotelId", getBookingsByHotel);
router.get("/all-bookings", getAllBookings);

export default router;
