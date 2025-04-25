import React, { useEffect, useState } from "react";
import { Calendar, MapPin, X, CreditCard, AlertCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:3000"; // Ensure this matches your backend

const EventCard = ({ event, onBuyTicket }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
      <img
        src={event.eventImage}
        alt={event.eventName}
        className="w-full h-56 object-cover"
      />
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-900 truncate">
          {event.eventName}
        </h2>

        {/* Event Date */}
        <div className="flex items-center text-gray-600 text-sm mt-3">
          <Calendar size={18} className="mr-2 text-blue-500" />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>

        {/* Event Location */}
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <MapPin size={18} className="mr-2 text-red-500" />
          <span>{event.eventLocation}</span>
        </div>

        {/* Event Details */}
        <p className="mt-3 text-gray-700 text-sm leading-relaxed h-16 overflow-hidden">
          {event.eventDetails}
        </p>

        {/* Button */}
        <button
          onClick={() => onBuyTicket(event)}
          className="mt-5 bg-yellow-500 text-white px-5 py-2 rounded-lg w-full font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
        >
          BUY TICKET
        </button>
      </div>
    </div>
  );
};

const PaymentModal = ({ event, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tickets: 1,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {step === 1 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Event Registration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  name="tickets"
                  value={formData.tickets}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

            {/* Event Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-2">{event.eventName}</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Tickets:</span>
                <span>
                  {formData.tickets} × ${event.price || "50"}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${(event.price || 50) * formData.tickets}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <CreditCard size={20} className="mr-2" />
                Payment Method
              </h3>
              <div className="border rounded-lg p-4">
                <p className="text-gray-600 text-sm">
                  Payment processing is handled securely by our payment
                  provider.
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <AlertCircle size={20} className="mr-2" />
                Cancellation Policy
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <ul className="space-y-2">
                  <li>• Full refund available up to 7 days before the event</li>
                  <li>
                    • 50% refund available between 7 days and 48 hours before
                    the event
                  </li>
                  <li>• No refund available within 48 hours of the event</li>
                  <li>
                    • All cancellations must be requested through our support
                    system
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={onClose}
                className="w-1/2 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300"
              >
                Complete Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LocalEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/event/approved`);
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedEvents();
  }, []);

  const handleBuyTicket = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          🎉 Local Events happening in Nepal
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse">
            Loading events...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No approved events available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onBuyTicket={handleBuyTicket}
              />
            ))}
          </div>
        )}

        {selectedEvent && (
          <PaymentModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default LocalEventsPage;
