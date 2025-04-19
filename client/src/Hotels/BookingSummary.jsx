import React from "react";
import { Calendar, Users, CreditCard } from "lucide-react";

const BookingSummary = ({ selectedRoom, showPaymentMethod = false }) => {
  if (!selectedRoom) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Booking Summary
        </h3>
        <p className="text-gray-600">No room selected yet.</p>
      </div>
    );
  }

  // Extract room details
  const {
    type,
    price,
    checkInDate,
    checkOutDate,
    maxGuests,
    selectedRooms,
    hotelName,
  } = selectedRoom;

  // Ensure `selectedRooms` is at least 1
  const totalRooms = selectedRooms || 1;

  // Calculate nights stayed
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.max(
    Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)),
    1
  );

  // Calculate total price based on number of rooms
  const totalPrice = price * nights * totalRooms;

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>

      <div className="space-y-4">
        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div className="font-medium">Hotel</div>
          <div className="text-right font-semibold">
            {hotelName || "Hotel Not Found"}
          </div>
        </div>

        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div className="font-medium">Room Type</div>
          <div className="text-right font-semibold">{type}</div>
        </div>

        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div className="font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Check-in
          </div>
          <div className="text-right font-semibold">
            {formatDate(checkInDate)}
          </div>
        </div>

        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div className="font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Check-out
          </div>
          <div className="text-right font-semibold">
            {formatDate(checkOutDate)}
          </div>
        </div>

        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div className="font-medium flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Guests
          </div>
          <div className="text-right font-semibold">{maxGuests} Guests</div>
        </div>

        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div className="font-medium">Number of Rooms</div>
          <div className="text-right font-semibold">
            {totalRooms} {totalRooms === 1 ? "Room" : "Rooms"}
          </div>
        </div>

        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div className="font-medium">Room Price</div>
          <div className="text-right font-semibold">
            ${price} × {nights} nights × {totalRooms} rooms
          </div>
        </div>

        <div className="flex justify-between text-lg">
          <div className="font-bold">Total</div>
          <div className="text-right font-bold text-blue-600">
            ${totalPrice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
