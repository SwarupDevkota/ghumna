import React, { useContext, useRef, useState } from "react";
import { AppContent } from "../context/AppContext";
import {
  User,
  PawPrint,
  Heart,
  Calendar,
  Settings,
  LogOut,
  Edit,
  ArrowRightCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const Sidebar = ({ activeTab, setActiveTab, user = {} }) => {
  const { userData, setUserData, setIsLoggedin, backendUrl } =
    useContext(AppContent);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleLogout = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/auth/logout");
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData({});
        Cookies.remove("token");
        navigate("/login");
        toast.success("Successfully logged out!");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
      toast.error("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
      {/* Profile Section */}
      <div className="p-6 text-center">
        <div className="relative mx-auto w-32 h-32 mb-4">
          <img
            src={userData?.image || "/default-avatar.png"}
            alt={userData?.name || "User"}
            className="rounded-full w-full h-full object-cover border-4 border-purple-500"
          />
          <button
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
            disabled={isUploading}
          >
            {isUploading ? "..." : <Edit className="h-4 w-4" />}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          {userData?.name || "Guest User"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Member since {user?.joinDate || "N/A"}
        </p>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-gray-200 mt-4">
        <nav className="flex flex-col">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "profile"
                ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <User className="mr-3 h-5 w-5" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "settings"
                ? "bg-amber-50 text-amber-700 border-l-4 border-amber-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Account Settings
          </button>
          {userData?.role === "user" && (
            <Link to="/hoteliers-form">
              <button className="flex items-center px-6 py-3 text-sm font-medium">
                <Calendar className="mr-3 h-5 w-5" />
                Hoteliers Form Application
                <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {user?.applications?.length ?? 0}
                </span>
              </button>
            </Link>
          )}
          {userData?.role === "hotelier" && (
            <Link to="/hotelier-rooms">
              <button className="flex items-center px-6 py-3 text-sm font-medium">
                <Calendar className="mr-3 h-5 w-5" />
                Hotelier Dashboard
              </button>
            </Link>
          )}
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
