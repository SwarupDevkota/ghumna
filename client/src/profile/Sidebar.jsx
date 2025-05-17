import React, { useContext, useRef, useState } from "react";
import { AppContent } from "../context/AppContext";
import {
  User,
  Calendar,
  Settings,
  LogOut,
  Edit,
  Hotel,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const Sidebar = ({ activeTab, setActiveTab = {} }) => {
  const { userData, setUserData, setIsLoggedIn, backendUrl } =
    useContext(AppContent);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/logout`);
      if (response.data.success) {
        setIsLoggedIn(false);
        setUserData({});
        Cookies.remove("token");
        navigate("/login");
        toast.success("Successfully logged out!");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setIsUploading(true);
    try {
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { withCredentials: false }
      );

      const imageUrl = uploadResponse.data.secure_url;

      await axios.put(
        `${backendUrl}/api/user/update-profile-img`,
        { email: userData?.email, image: imageUrl },
        { withCredentials: true }
      );

      setUserData((prevData) => ({ ...prevData, image: imageUrl }));
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = ""; // Reset file input
    }
  };

  // Format join date if available
  const formatJoinDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6 h-fit">
      {/* Profile Section */}
      <div className="p-6 text-center">
        <div className="relative mx-auto w-32 h-32 mb-4">
          <img
            src={userData?.image || "/default-avatar.png"}
            alt={userData?.name || "User"}
            className="rounded-full w-full h-full object-cover border-4 border-purple-500"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <button
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
            disabled={isUploading}
            aria-label="Change profile picture"
          >
            {isUploading ? (
              <span className="animate-pulse">...</span>
            ) : (
              <Edit className="h-4 w-4" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/gif"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 truncate px-2">
          {userData?.name || "Guest User"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Member since 2025
        </p>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-gray-200">
        <nav className="flex flex-col">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <User className="mr-3 h-5 w-5 flex-shrink-0" />
            Profile Information
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-amber-50 text-amber-700 border-l-4 border-amber-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
            Account Settings
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "applications"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Calendar className="mr-3 h-5 w-5 flex-shrink-0" />
            My Applications
            {userData?.applications?.length > 0 && (
              <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {userData.applications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("event-registration")}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "event-registration"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Calendar className="mr-3 h-5 w-5 flex-shrink-0" />
            Events Registration
          </button>

          <button
            onClick={() => setActiveTab("availability-requests")}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "availability-requests"
                ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Calendar className="mr-3 h-5 w-5 flex-shrink-0" />
            Availability Requests
          </button>

          {userData?.role === "user" && (
            <Link
              to="/hoteliers-form"
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Hotel className="mr-3 h-5 w-5 flex-shrink-0" />
              Hoteliers Form Application
            </Link>
          )}

          {userData?.role === "hotelier" && (
            <Link
              to="/hotelier-rooms"
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Hotel className="mr-3 h-5 w-5 flex-shrink-0" />
              Hotelier Dashboard
            </Link>
          )}

          {userData?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Shield className="mr-3 h-5 w-5 flex-shrink-0" />
              Admin Dashboard
            </Link>
          )}
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Sidebar;
