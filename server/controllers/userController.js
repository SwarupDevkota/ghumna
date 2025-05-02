import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    // Ensure userId is provided
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Find user by the provided userId
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Return the user data
    res.json({
      success: true,
      userData: {
        userId: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        role: user.role,
        image: user.image,
        contact: user.contact,
        address: user.address,
        description: user.description,
        ownedHotel: user.ownedHotels,
      },
    });
  } catch (error) {
    // Return the error message in the response
    res.json({ success: false, message: error.message });
  }
};

// Get all users data
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find(
      {},
      "name email role image isAccountVerified createdAt"
    );

    // If no users found
    if (!users.length) {
      return res.json({ success: false, message: "No users found" });
    }

    // Return all users' data
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Profile Image Controller
export const updateProfileImage = async (req, res) => {
  try {
    const { email, image } = req.body;

    if (!email || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Email and image URL are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Update user's profile image
    user.image = image;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      image: user.image,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Fetch the current user (use token or userId to get the user from DB)
    const user = await User.findById(req.body.userId);

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, contact, address, description } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only the fields that are provided in the request
    // (empty strings will be saved if provided)
    if (req.body.hasOwnProperty("name")) user.name = name;
    if (req.body.hasOwnProperty("email")) user.email = email;
    if (req.body.hasOwnProperty("contact")) user.contact = contact;
    if (req.body.hasOwnProperty("address")) user.address = address;
    if (req.body.hasOwnProperty("description")) user.description = description;

    // Validate before saving (optional)
    await user.validate();

    const updatedUser = await user.save();

    // Return the complete updated user data
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
        address: updatedUser.address,
        description: updatedUser.description,
        // Include any other fields you want to expose
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
