import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  const pidx = searchParams.get("pidx");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!pidx) {
        setStatus("Missing payment ID");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/payment/verify",
          {
            pidx,
          }
        );

        setTransaction(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error(
          "❌ Verification failed:",
          error.response?.data || error.message
        );
        setStatus("Verification failed");
      }
    };

    verifyPayment();
  }, [pidx]);

  const isSuccess = status === "Completed";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8">
        <div className="text-center">
          {isSuccess ? (
            <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          ) : (
            <XCircle className="text-red-500 mx-auto mb-4" size={64} />
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            Payment {isSuccess ? "Successful" : status}
          </h1>
          <p className="text-gray-600 mt-2">
            {isSuccess
              ? "Your transaction has been confirmed. Here are your payment details:"
              : status === "Verifying..."
              ? "Verifying your transaction..."
              : "We could not confirm your payment. Please contact support."}
          </p>
        </div>

        {transaction && isSuccess && (
          <div className="mt-8 border-t pt-6 text-left space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Transaction ID:</span>
              <span>{transaction.transaction_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span>{transaction.purchase_order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount Paid:</span>
              <span>Rs. {transaction.total_amount / 100}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Mobile Number:</span>
              <span>{transaction.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-green-600 font-semibold">
                {transaction.status}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate("/profile")} // or `/user/bookings` if you have one
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
