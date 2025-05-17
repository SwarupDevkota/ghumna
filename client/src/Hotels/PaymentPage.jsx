import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// import BookingSummary from "./BookingSummary"; // Uncomment if needed

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.bookingData;

  const handleKhaltiPayment = async () => {
    if (!booking) {
      alert("No booking data found.");
      return;
    }

    const payload = {
      return_url: "http://localhost:5173/confirmation", // Will receive pidx here
      website_url: "http://localhost:5173",
      amount: booking.totalPrice * 100, // Convert to paisa
      purchase_order_id: booking.bookingId,
      purchase_order_name: booking.roomType,
      customer_info: {
        name: booking.hotelName,
        email: "guest@example.com", // Replace with dynamic email if available
        phone: "9800000001", // Replace with actual phone in prod
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/payment/pay",
        payload
      );
      const { payment_url } = response.data;

      if (payment_url) {
        window.location.href = payment_url;
      } else {
        throw new Error("No payment_url returned from backend.");
      }
    } catch (error) {
      console.error(
        "❌ Khalti initiation failed:",
        error.response?.data || error.message
      );
      alert("Failed to initiate Khalti payment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Complete Your Booking
        </h1>

        <div className="space-y-2">
          <p>
            <strong>Hotel:</strong> {booking?.hotelName}
          </p>
          <p>
            <strong>Room:</strong> {booking?.roomType}
          </p>
          <p>
            <strong>Check-In:</strong> {booking?.checkInDate}
          </p>
          <p>
            <strong>Check-Out:</strong> {booking?.checkOutDate}
          </p>
          <p>
            <strong>Guests:</strong> {booking?.numberOfGuests}
          </p>
          <p>
            <strong>Total Price:</strong> Rs. {booking?.totalPrice}
          </p>
        </div>

        <button
          onClick={handleKhaltiPayment}
          className="mt-6 w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded hover:bg-purple-700 transition"
        >
          Pay with Khalti
        </button>
      </div>

      {/* Uncomment this section if you want to show a visual booking summary */}
      {/* <div className="max-w-2xl mx-auto mt-4">
        {booking && <BookingSummary bookingDetails={booking} />}
      </div> */}
    </div>
  );
};

export default PaymentPage;
