import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle } from "lucide-react";
import BookingSummary from "./BookingSummary";

const PaymentPage = () => {
  const navigate = useNavigate();

  // Static booking details
  const bookingDetails = {
    hotel: "Grand Hotel",
    room: "Deluxe Suite",
    checkIn: "2025-03-15",
    checkOut: "2025-03-20",
    price: 250,
  };

  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      alert("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      navigate("/confirmation");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-blue-600 py-8 text-center">
        <h1 className="text-3xl font-bold text-white">Payment Details</h1>
        <p className="text-blue-100 mt-2">
          Complete your booking by providing payment information
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Payment Method
          </h2>

          <div className="flex space-x-4 mb-6">
            {["credit", "debit", "paypal"].map((method) => (
              <button
                key={method}
                type="button"
                className={`flex-1 py-3 px-4 rounded-md border transition duration-300 flex items-center justify-center ${
                  paymentMethod === method
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-600 hover:border-blue-300"
                }`}
                onClick={() => setPaymentMethod(method)}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {method.charAt(0).toUpperCase() + method.slice(1)} Card
              </button>
            ))}
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border p-2 rounded"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
            <input
              type="text"
              placeholder="Card Holder Name"
              className="w-full border p-2 rounded"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border p-2 rounded"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-full border p-2 rounded"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isProcessing ? "Processing..." : "Complete Booking"}
            </button>
          </form>
        </div>

        <div className="md:w-1/3">
          <BookingSummary bookingDetails={bookingDetails} />
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 inline" />
            <span className="text-gray-800 font-semibold">
              Free Cancellation
            </span>
            <p className="text-sm text-gray-600">
              Cancel before{" "}
              {new Date(bookingDetails.checkIn).toLocaleDateString()} for a full
              refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
