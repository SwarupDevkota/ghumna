import express from "express";
import {
  saveContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

// Route to save a contact
router.post("/", saveContact);

// Route to get all contacts
router.get("/", getAllContacts);

// Route to delete a contact by ID
router.delete("/:id", deleteContact);

export default router;
