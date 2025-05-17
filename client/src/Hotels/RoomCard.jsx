import React, { useState } from "react";
import { Users, Check, Calendar } from "lucide-react";

const RoomCard = ({
  room,
  isSelected,
  onSelect,
  onDateChange,
  selectedCheckIn,
  selectedCheckOut,
}) => {
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [guestCount, setGuestCount] = useState(1);

  const handleRoomChange = (e) => {
    setSelectedRooms(Number(e.target.value));
  };

  const handleGuestChange = (e) => {
    const count = Math.min(Math.max(1, Number(e.target.value)), room.maxGuests);
    setGuestCount(count);
  };

  const handleSelect = () => {
    onSelect({
      rooms: selectedRooms,
      guests: guestCount,
    });
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-blue-500 shadow-md bg-blue-50"
          : "border-gray-200 hover:border-blue-300 hover:shadow"
      }`}
    >
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img
            src={room.images[0]} // Using first image from array
            alt={room.type}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {room.type} - Room {room.roomNumber}
              </h3>
              <div className="flex items-center text-gray-600 mb-1">
                <Users className="h-4 w-4 mr-1" />
                <span>Max {room.maxGuests} guests</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{room.description}</p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                Rs. {room.price}
              </div>
              <div className="text-gray-500 text-sm">per night</div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 flex items-center font-medium text-sm">
                <Calendar className="h-4 w-4 mr-2" /> Check-in Date
              </label>
              <input
                type="date"
                value={selectedCheckIn}
                onChange={(e) => onDateChange("checkIn", e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="text-gray-700 flex items-center font-medium text-sm">
                <Calendar className="h-4 w-4 mr-2" /> Check-out Date
              </label>
              <input
                type="date"
                value={selectedCheckOut}
                onChange={(e) => onDateChange("checkOut", e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
                min={selectedCheckIn || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Guest Count Input */}
          <div className="mb-4">
            <label className="text-gray-700 font-medium text-sm">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              max={room.maxGuests}
              value={guestCount}
              onChange={handleGuestChange}
              className="w-full border p-2 rounded-md mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum {room.maxGuests} guests allowed
            </p>
          </div>

          {/* Number of Rooms Selection */}
          <div className="mb-4">
            <label className="text-gray-700 font-medium text-sm">
              Number of Rooms
            </label>
            <select
              value={selectedRooms}
              onChange={handleRoomChange}
              className="w-full border p-2 rounded-md mt-1"
            >
              {Array.from({ length: 5 }, (_, i) => i + 1).map(
                // Assuming max 5 rooms can be selected
                (num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Room" : "Rooms"}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            onClick={handleSelect}
            className={`w-full py-2 rounded-md transition-colors ${
              isSelected
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSelected ? (
              <span className="flex items-center justify-center">
                <Check className="h-4 w-4 mr-2" /> Selected ({selectedRooms}{" "}
                rooms, {guestCount} guests)
              </span>
            ) : (
              "Select Room"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
