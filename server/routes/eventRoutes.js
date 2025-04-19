import express from "express";
import {
  saveEvent,
  getAllEvents,
  approveEvent,
  rejectEvent,
  getApprovedEvents,
} from "../controllers/eventController.js";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// ✅ Register event (with image upload)
router.post("/", upload.single("eventImage"), saveEvent);

// ✅ Get all events
router.get("/", getAllEvents);

// Approve an event
router.post("/:eventId/approve", approveEvent);

// Reject an event
router.post("/:eventId/reject", rejectEvent);

router.get("/approved", getApprovedEvents);

export default router;
