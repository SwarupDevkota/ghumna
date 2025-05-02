import express from "express";
import {
  approveHotel,
  deleteHotelier,
  editHotelier,
  getApprovedHotels,
  getDeclinedHotels,
  submitHotel,
  getHotelById,
  getAllHotels,
  rejectHotel,
} from "../controllers/hotelRequestController.js";
import { body } from "express-validator";

const router = express.Router();
// const upload = multer({ dest: "uploads/" }); // Configure multer for file uploads

// Define the route for hotel form submission
// Validation middleware for hotel submission
const hotelValidation = [
  body("name").notEmpty().withMessage("Hotel name is required"),
  body("owner").isMongoId().withMessage("Valid owner ID is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("description").optional().isString(),
  body("website").optional().isURL().withMessage("Valid URL is required"),
  body("amenities").optional().isArray(),
  body("nearbyAttractions").optional().isArray(),
  body("registrationDocument").optional().isString(),
  body("additionalDocuments").optional().isArray(),
  body("images").optional().isArray(),
];

// Route to submit a new hotel
router.post("/submit", hotelValidation, submitHotel);

router.get("/requests", getAllHotels); // Route to fetch all hotel requests

router.post("/approve-hotel", approveHotel);
router.post("/reject-hotel", rejectHotel);

router.get("/approved-hotels", getApprovedHotels);
router.get("/declined-hotels", getDeclinedHotels);

router.delete("/delete-hotelier/:hotelId", deleteHotelier);
router.put("/edit-hotelier/:hotelId", editHotelier);
router.get("/hotels/:id", getHotelById);

export default router;
