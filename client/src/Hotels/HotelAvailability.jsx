import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Mail,
  Phone,
  Users,
  Building,
  BedDouble,
  FileText,
} from "lucide-react";
import { AppContent } from "../context/AppContext";

const API_URL = "http://localhost:3000/api/hotel-availability"; // Update with actual backend URL

const HotelAvailabilityForm = () => {
  const { userData } = useContext(AppContent);
  const { id } = useParams(); // Hotel ID from URL

  // State for form data
  const [formData, setFormData] = useState({
    phone: "",
    guests: "",
    company: "",
    rooms: "",
    criteria: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      hotelId: id, // Attach hotel ID
      email: userData?.email,
      ...formData, // Spread form fields
    };

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✔ Availability request sent successfully!");
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error("❌ Error submitting availability form:", error);
      alert("❌ Failed to submit. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white p-5">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center font-bold text-gray-800 text-xl mb-6">
          Hotel Room Availability Check
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email (Read-Only) */}
          <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-100">
            <Mail className="text-gray-600 mr-2" />
            <input
              type="email"
              name="email"
              value={userData?.email}
              readOnly
              className="w-full bg-transparent outline-none cursor-not-allowed text-gray-500"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border border-gray-300 p-2 rounded-lg">
            <Phone className="text-gray-600 mr-2" />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Number of Guests */}
          <div className="flex items-center border border-gray-300 p-2 rounded-lg">
            <Users className="text-gray-600 mr-2" />
            <input
              type="number"
              name="guests"
              min="1"
              placeholder="Number of Guests"
              required
              value={formData.guests}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Company Name (Optional) */}
          <div className="flex items-center border border-gray-300 p-2 rounded-lg">
            <Building className="text-gray-600 mr-2" />
            <input
              type="text"
              name="company"
              placeholder="Company Name (Optional)"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Number of Rooms Needed */}
          <div className="flex items-center border border-gray-300 p-2 rounded-lg">
            <BedDouble className="text-gray-600 mr-2" />
            <input
              type="number"
              name="rooms"
              min="1"
              placeholder="Number of Rooms Needed"
              required
              value={formData.rooms}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* Special Criteria */}
          <div className="flex items-center border border-gray-300 p-2 rounded-lg">
            <FileText className="text-gray-600 mr-2" />
            <textarea
              name="criteria"
              rows="3"
              placeholder="Special Criteria/Description"
              value={formData.criteria}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg text-lg font-bold hover:bg-gray-700 transition"
          >
            Check Availability
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelAvailabilityForm;
