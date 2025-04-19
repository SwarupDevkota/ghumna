import React, { useContext, useState } from "react";
import { Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const ProfileInfo = () => {
  const { userData, setUserData } = useContext(AppContent);

  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(userData);

  // Handle input changes
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle form submission (Update user data)
  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/user/update",
        updatedUser
      );
      setUserData(response.data); // Update context state
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Profile Information
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Your personal information and contact details.
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{userData?.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <Mail className="mr-2 h-4 w-4 text-gray-400" />
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleChange}
                  className="p-2 border rounded-md w-full"
                />
              ) : (
                userData?.email
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <Phone className="mr-2 h-4 w-4 text-gray-400" />
              {editMode ? (
                <input
                  type="text"
                  name="contact"
                  value={updatedUser.contact}
                  onChange={handleChange}
                  className="p-2 border rounded-md w-full"
                />
              ) : (
                userData?.contact
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Location</h4>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={updatedUser.address}
                  onChange={handleChange}
                  className="p-2 border rounded-md w-full"
                />
              ) : (
                userData?.address
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500">Bio</h4>
          {editMode ? (
            <textarea
              name="description"
              value={updatedUser.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {userData?.description}
            </p>
          )}
        </div>

        {/* Buttons: Edit, Save, Cancel */}
        <div className="mt-6 flex space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50"
              >
                <Save className="mr-2 h-4 w-4 text-green-500" />
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <X className="mr-2 h-4 w-4 text-red-500" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="mr-2 h-4 w-4 text-gray-500" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
