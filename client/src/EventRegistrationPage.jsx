import React, { useState } from "react";
import {
  Calendar,
  File,
  Info,
  Image,
  User,
  Briefcase,
  MapPin,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:3000"; // Update if needed
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const EventRegistrationPage = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventManager: "",
    eventOrganization: "",
    eventDate: "",
    eventDetails: "",
    eventLocation: "",
    eventImage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, eventImage: file }));
    } else {
      toast.error("Please select an image file!");
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    const formDataToUpload = new FormData();
    formDataToUpload.append("file", imageFile);
    formDataToUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formDataToUpload,
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Failed to upload image");
      return data.secure_url; // Cloudinary URL of uploaded image
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Image upload failed!");
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.eventImage) {
      toast.error("Please select an image!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Cloudinary first
      const uploadedImageUrl = await uploadImageToCloudinary(
        formData.eventImage
      );

      if (!uploadedImageUrl) {
        throw new Error("Image upload failed!");
      }

      // Send event data with Cloudinary image URL to backend
      const eventData = {
        ...formData,
        eventImage: uploadedImageUrl, // Use Cloudinary URL instead of the file
      };

      const response = await fetch(`${API_BASE_URL}/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to register the event.");
      }

      toast.success("Event registered successfully!");
      setFormData({
        eventName: "",
        eventManager: "",
        eventOrganization: "",
        eventDate: "",
        eventLocation: "",
        eventDetails: "",
        eventImage: null,
      });
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      toast.error(`Failed to register the event: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Event Registration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="text-gray-500" />
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Event Name"
              className="w-full p-2 border rounded-md focus:outline-blue-500"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Briefcase className="text-gray-500" />
            <input
              type="text"
              name="eventManager"
              value={formData.eventManager}
              onChange={handleChange}
              placeholder="Event Manager"
              className="w-full p-2 border rounded-md focus:outline-blue-500"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Info className="text-gray-500" />
            <input
              type="text"
              name="eventOrganization"
              value={formData.eventOrganization}
              onChange={handleChange}
              placeholder="Event Organization"
              className="w-full p-2 border rounded-md focus:outline-blue-500"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-500" />
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-blue-500"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="text-gray-500" />
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-blue-500"
              required
            />
          </div>

          <div className="flex items-start space-x-2">
            <File className="text-gray-500 mt-2" />
            <textarea
              name="eventDetails"
              value={formData.eventDetails}
              onChange={handleChange}
              placeholder="Event Details"
              className="w-full p-2 border rounded-md focus:outline-blue-500"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="flex items-center space-x-2">
            <Image className="text-gray-500" />
            <input
              type="file"
              name="eventImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md focus:outline-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white py-2 px-4 rounded-md ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
