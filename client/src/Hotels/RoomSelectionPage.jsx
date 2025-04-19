import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomCard from "./RoomCard";
import BookingSummary from "./BookingSummary";
import HotelAvailabilityForm from "./HotelAvailability";

const API_URL = "http://localhost:3000/api/room-details"; // Base API URL

const RoomSelectionPage = () => {
  const { id } = useParams(); // Get hotel ID from URL
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null); // Store hotel details
  const [rooms, setRooms] = useState([]); // Store available rooms
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState("");
  const [selectedCheckOut, setSelectedCheckOut] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state

  // Fetch hotel details & rooms using hotel ID
  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`); // Query param
        if (!response.ok) throw new Error("Failed to fetch hotel details.");

        const data = await response.json();
        setHotel(data); // Store hotel data
        setRooms(data.rooms || []); // Store available rooms
      } catch (error) {
        console.error("❌ Error fetching hotel details:", error);
        setError("Failed to load hotel details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]); // Fetch whenever `id` changes

  const handleDateChange = (type, value) => {
    if (type === "checkIn") {
      setSelectedCheckIn(value);
    } else if (type === "checkOut") {
      setSelectedCheckOut(value);
    }
  };

  const handleRoomSelect = (room, selectedRooms) => {
    if (!selectedCheckIn || !selectedCheckOut) {
      alert("Please select both Check-in and Check-out dates first!");
      return;
    }

    const selectedRoomData = {
      ...room,
      hotelName: hotel?.hotelName, // Ensure hotel name is included
      checkInDate: selectedCheckIn,
      checkOutDate: selectedCheckOut,
      selectedRooms, // Store number of rooms selected
    };

    console.log("🏨 Room Selected with Details:", selectedRoomData);
    setSelectedRoom(selectedRoomData);
  };

  const handleContinue = () => {
    if (!selectedRoom) {
      alert("Please select a room to continue");
      return;
    }

    console.log("🚀 Proceeding to payment with:", selectedRoom);
    navigate("/payment", { state: { selectedRoom } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner */}
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            {hotel?.hotelName || "Select Your Room"}
          </h1>
          <p className="text-blue-100 mt-2">
            {loading
              ? "Fetching hotel details..."
              : error
              ? error
              : `Available rooms in ${hotel.hotelName}`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading rooms...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Room List Section */}
            <div className="md:w-2/3">
              {rooms.length === 0 ? (
                <p className="text-gray-600">No rooms available.</p>
              ) : (
                <div className="space-y-6">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room._id}
                      room={room}
                      isSelected={selectedRoom?._id === room._id}
                      onSelect={(selectedRooms) =>
                        handleRoomSelect(room, selectedRooms)
                      }
                      onDateChange={handleDateChange}
                      selectedCheckIn={selectedCheckIn}
                      selectedCheckOut={selectedCheckOut}
                    />
                  ))}
                </div>
              )}

              {/* Continue Button */}
              <div className="mt-8">
                <button
                  onClick={handleContinue}
                  disabled={!selectedRoom}
                  className={`w-full md:w-auto py-3 px-8 rounded-md transition duration-300 ${
                    selectedRoom
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            </div>

            {/* Booking Summary + Hotel Availability Form */}
            <div className="md:w-1/3 mt-8 md:mt-0">
              {/* Booking Summary Component */}
              <BookingSummary selectedRoom={selectedRoom} />

              {/* Hotel Availability Form Below the Summary */}
              <HotelAvailabilityForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelectionPage;
