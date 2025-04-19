import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { connect, connection } = mongoose; // Destructure the properties from the default import

const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connect(uri); // No need for useNewUrlParser and useUnifiedTopology
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }

  // Handle connection events
  connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });
};

export default connectDB;
