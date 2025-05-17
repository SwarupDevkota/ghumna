import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./db.js";
import contactRoutes from "./routes/contactRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import hotelRoutes from "./routes/hotelRequestRoutes.js"; // Import hotel routes
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow all origins dynamically
    },
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ Enables req.cookies to work properly

app.use("/uploads", express.static("uploads"));

// Define routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/hotels", hotelRoutes); // Use hotel routes
app.use("/api/rooms", roomRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/payment", paymentRoutes); // ⬅️ Enable endpoint: /api/pay


// 404 Handler for Unknown Routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found.",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(err.status || 500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
