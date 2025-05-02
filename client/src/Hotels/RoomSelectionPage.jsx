import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomCard from "./RoomCard";
import BookingSummary from "./BookingSummary";
import HotelAvailabilityForm from "./HotelAvailability";
import { AppContent } from "../context/AppContext";

const API_URL = "http://localhost:3000/api/rooms";

const RoomSelectionPage = () => {
  const { userData } = useContext(AppContent);
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState("");
  const [selectedCheckOut, setSelectedCheckOut] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rooms using hotel ID
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}?hotelId=${id}`);
        if (!response.ok) throw new Error("Failed to fetch rooms.");

        const roomsData = await response.json();

        if (!Array.isArray(roomsData)) {
          throw new Error("Invalid data format received from server");
        }

        console.log("Rooms data:", roomsData);

        if (roomsData.length > 0) {
          // Set hotel info from the first room (since all rooms belong to same hotel)
          setHotel({
            _id: roomsData[0].hotel._id,
            hotelName: roomsData[0].hotel.name,
            email: roomsData[0].hotel.email,
          });
        }

        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.message || "Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [id]);

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

    // Destructure the selectedRooms object properly
    const { rooms: selectedRoomCount, guests } = selectedRooms || {
      rooms: 1,
      guests: room.maxGuests,
    };

    const selectedRoomData = {
      ...room,
      hotelName: room.hotel.name,
      checkInDate: selectedCheckIn,
      checkOutDate: selectedCheckOut,
      selectedRooms: selectedRoomCount, // number of rooms selected
      guests: guests, // number of guests
    };

    console.log("Selected Room:", selectedRoomData);
    setSelectedRoom(selectedRoomData);
  };

  const handleContinue = async () => {
    if (!selectedRoom) {
      alert("Please select a room to continue");
      return;
    }

    const checkIn = new Date(selectedRoom.checkInDate);
    const checkOut = new Date(selectedRoom.checkOutDate);
    const nights = Math.max(
      Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)),
      1
    );

    const bookingData = {
      hotel: selectedRoom.hotel._id, // matches schema
      user: userData?.userId, // matches schema
      rooms: [selectedRoom._id], // array of room IDs as per schema
      checkInDate: selectedRoom.checkInDate,
      checkOutDate: selectedRoom.checkOutDate,
      numberOfGuests: selectedRoom.guests,
      totalPrice:
        selectedRoom.price * nights * (selectedRoom.selectedRooms || 1),
      paymentStatus: "Pending", // matches your enum
      specialRequests: "", // can be empty or add a field for this
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/booking/book-room",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Booking failed");
      }

      const result = await response.json();
      console.log("Booking successful:", result);

      navigate("/payment", {
        state: {
          bookingData: {
            ...bookingData,
            bookingId: result.booking._id, // using the returned booking ID
            hotelName: selectedRoom.hotel.name, // for display purposes
            roomType: selectedRoom.type, // for display purposes
          },
        },
      });
    } catch (error) {
      console.error("Error during booking:", error);
      alert(error.message || "Failed to book the room. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            {hotel?.hotelName || "Select Your Room"}
          </h1>
          <p className="text-blue-100 mt-2">
            {loading
              ? "Fetching rooms..."
              : error
              ? error
              : `Available rooms in ${hotel?.hotelName}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading rooms...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
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
                  Book Now
                </button>
              </div>
            </div>

            <div className="md:w-1/3 mt-8 md:mt-0">
              {selectedRoom && <BookingSummary selectedRoom={selectedRoom} />}
              <HotelAvailabilityForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelectionPage;
