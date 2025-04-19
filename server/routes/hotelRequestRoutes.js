import express from "express";
import {
  approveHotel,
  declineHotel,
  deleteHotelier,
  editHotelier,
  getApprovedHotels,
  getDeclinedHotels,
  revertHotelierToPending,
  submitHotel,
  getHotelById,
} from "../controllers/hotelRequestController.js";
import upload from "../config/multer.js";
import { getHotelRequests } from "../controllers/hotelRequestController.js";

const router = express.Router();
// const upload = multer({ dest: "uploads/" }); // Configure multer for file uploads

// Define the route for hotel form submission
router.post("/submit", upload, submitHotel); // ✅ Apply multer before controller

router.get("/requests", getHotelRequests); // Route to fetch all hotel requests

router.post("/approve-hotel", approveHotel);
router.post("/reject-hotel", declineHotel);
router.get("/approved-hotels", getApprovedHotels);
router.get("/declined-hotels", getDeclinedHotels);

router.delete("/delete-hotelier/:hotelId", deleteHotelier);
router.put("/edit-hotelier/:hotelId", editHotelier);
router.put("/revert-hotelier/:hotelId", revertHotelierToPending);

router.get("/hotels/:id", getHotelById);

export default router;
