// routes/paymentRoutes.js
import express from "express";
const router = express.Router();
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} from "../controllers/paymentController.js";

router.post("/pay", initiateKhaltiPayment);
router.post("/verify", verifyKhaltiPayment); // ✅ Add this line

export default router;
