import multer from "multer";
import path from "path";

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Allowed File Fields
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
}).fields([
  { name: "hotelRegistrationDocument", maxCount: 1 },
  { name: "additionalDocuments", maxCount: 10 },
  { name: "images", maxCount: 10 },
  { name: "khaltiQrCode", maxCount: 1 },
  { name: "phonePayQrCode", maxCount: 1 },
  { name: "eventImage", maxCount: 1 },
]);

export default upload;
