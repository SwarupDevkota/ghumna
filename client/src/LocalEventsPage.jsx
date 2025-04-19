import React, { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";

const API_BASE_URL = "http://localhost:3000"; // Ensure this matches your backend

const EventCard = ({ event }) => {
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
        <button className="mt-5 bg-yellow-500 text-white px-5 py-2 rounded-lg w-full font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105">
          BUY TICKET
        </button>
      </div>
    </div>
  );
};

const LocalEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalEventsPage;
