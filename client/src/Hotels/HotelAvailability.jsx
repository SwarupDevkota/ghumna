import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Phone, Users, BedDouble, FileText, Calendar } from "lucide-react";
import { AppContent } from "../context/AppContext";

const API_URL = "http://localhost:3000/api/rooms/hotel-availability";

const HotelAvailabilityForm = () => {
  const { userData } = useContext(AppContent);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    phone: "",
    guests: "",
    rooms: "",
    criteria: "",
    checkIn: "",
    checkOut: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      hotelId: id,
      userId: userData?.userId,
      ...formData,
    };

    console.log("Submitting data to backend:", requestData);

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
        alert("Availability request sent successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting availability form:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
        <h2 className="text-center font-semibold text-gray-800 text-xl mb-6">
          Check Room Availability
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-200 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Phone className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="tel"
                name="phone"
                placeholder="+1 (___) ___-____"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Check-in
              </label>
              <div className="flex items-center border border-gray-200 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Calendar className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  type="date"
                  name="checkIn"
                  required
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Check-out
              </label>
              <div className="flex items-center border border-gray-200 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <Calendar className="text-gray-500 mr-2 h-5 w-5" />
                <input
                  type="date"
                  name="checkOut"
                  required
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none"
                  min={
                    formData.checkIn || new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <div className="flex items-center border border-gray-200 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Users className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="number"
                name="guests"
                min="1"
                placeholder="2"
                required
                value={formData.guests}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Number of Rooms Needed */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Rooms Needed
            </label>
            <div className="flex items-center border border-gray-200 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <BedDouble className="text-gray-500 mr-2 h-5 w-5" />
              <input
                type="number"
                name="rooms"
                min="1"
                placeholder="1"
                required
                value={formData.rooms}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Special Criteria */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Special Requests
            </label>
            <div className="border border-gray-200 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <textarea
                name="criteria"
                rows="3"
                placeholder="Any special requirements or preferences..."
                value={formData.criteria}
                onChange={handleChange}
                className="w-full bg-transparent outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Check Availability
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelAvailabilityForm;
