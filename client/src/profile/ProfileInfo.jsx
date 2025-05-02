import React, { useContext, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const ProfileInfo = () => {
  const { userData, setUserData } = useContext(AppContent);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        contact: userData.contact || "",
        address: userData.address || "",
        description: userData.description || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Create an object with only the changed fields
      const updatedFields = {};

      // Compare each field with the original userData
      if (formData.name !== userData.name) updatedFields.name = formData.name;
      if (formData.email !== userData.email)
        updatedFields.email = formData.email;
      if (formData.contact !== userData.contact)
        updatedFields.contact = formData.contact;
      if (formData.address !== userData.address)
        updatedFields.address = formData.address;
      if (formData.description !== userData.description)
        updatedFields.description = formData.description;

      // Only make the API call if there are changes
      if (Object.keys(updatedFields).length > 0) {
        const response = await axios.put(
          `http://localhost:3000/api/user/update/${userData?.userId}`,
          updatedFields
        );

        setUserData(response.data);
        setEditMode(false);
        window.location.reload();
      } else {
        // No changes were made
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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
                value={formData.name}
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
                  value={formData.email}
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
                  value={formData.contact}
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
                  value={formData.address}
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
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              rows={4}
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {userData?.description || "No bio provided"}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
