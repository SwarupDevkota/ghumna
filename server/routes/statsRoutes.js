import express from "express";
import {
  getDashboardStats,
  getChartData,
  getHotelierDashboardStats,
  getHotelierChartData,
} from "../controllers/statsController.js";

const router = express.Router();

// Admin dashboard routes
router.get("/admin-stats", getDashboardStats); // GET /api/admin/stats

router.get("/chart-data", getChartData); // GET /api/admin/chart-data

// Hotelier dashboard routes
router.get("/dashboard/:hotelId", getHotelierDashboardStats); // GET /api/hotelier/dashboard/:hotelId

router.get("/chart-data/:hotelId", getHotelierChartData); // GET /api/hotelier/chart-data/:hotelId

export default router;
