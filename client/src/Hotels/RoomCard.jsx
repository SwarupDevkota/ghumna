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
  const [selectedRooms, setSelectedRooms] = useState(1); // Default to 1 room

  const handleRoomChange = (e) => {
    setSelectedRooms(Number(e.target.value));
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
            src={room.image}
            alt={room.type}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {room.type}
              </h3>
              <div className="flex items-center text-gray-600 mb-3">
                <Users className="h-4 w-4 mr-1" />
                <span>Up to {room.maxGuests} guests</span>
              </div>
              <div className="text-gray-600 mb-3">
                🏨 Room Count:{" "}
                <span className="font-medium">{room.roomCount}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ${room.price}
              </div>
              <div className="text-gray-500 text-sm">per night</div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 flex items-center font-medium">
                <Calendar className="h-4 w-4 mr-2" /> Check-in Date
              </label>
              <input
                type="date"
                value={selectedCheckIn} // Uses global date state
                onChange={(e) => onDateChange("checkIn", e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </div>

            <div>
              <label className="text-gray-700 flex items-center font-medium">
                <Calendar className="h-4 w-4 mr-2" /> Check-out Date
              </label>
              <input
                type="date"
                value={selectedCheckOut} // Uses global date state
                onChange={(e) => onDateChange("checkOut", e.target.value)}
                className="w-full border p-2 rounded-md mt-1"
              />
            </div>
          </div>

          {/* Number of Rooms Selection */}
          <div className="mb-4">
            <label className="text-gray-700 font-medium">
              Select Number of Rooms
            </label>
            <select
              value={selectedRooms}
              onChange={handleRoomChange}
              className="w-full border p-2 rounded-md mt-1"
            >
              {Array.from({ length: room.roomCount }, (_, i) => i + 1).map(
                (num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Room" : "Rooms"}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            onClick={() => onSelect(selectedRooms)} // Pass selected number of rooms
            className="bg-blue-600 text-white w-full py-2 rounded-md"
          >
            {isSelected ? `Selected (${selectedRooms} rooms)` : "Select Room"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
