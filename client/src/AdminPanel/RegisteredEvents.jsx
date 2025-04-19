import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:3000"; // Update to match your backend

const RegisteredEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/event`); // Ensure correct endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to fetch events. Please check your server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Open the modal with the selected event's details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleApproveEvent = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/event/${selectedEvent._id}/approve`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to approve the event.");
      }

      toast.success("Event approved successfully!");

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === selectedEvent._id
            ? { ...event, status: "Approved" }
            : event
        )
      );

      closeModal();
    } catch (err) {
      console.error("Error approving event:", err);
      toast.error("An error occurred while approving the event.");
    }
  };

  const handleRejectEvent = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/event/${selectedEvent._id}/reject`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to reject the event.");
      }

      toast.success("Event rejected successfully!");

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === selectedEvent._id
            ? { ...event, status: "Declined" }
            : event
        )
      );

      closeModal();
    } catch (err) {
      console.error("Error rejecting event:", err);
      toast.error("An error occurred while rejecting the event.");
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-grow p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-5" : "ml-16"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6 text-blue-700">
          Registered Events
        </h1>

        {/* Show loading, error, or data */}
        {isLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading events...</span>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-gray-600">No events registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 shadow-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Event Name</th>
                  <th className="px-4 py-2 text-left">Manager</th>
                  <th className="px-4 py-2 text-left">Organization</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{event.eventName}</td>
                    <td className="px-4 py-2">{event.eventManager}</td>
                    <td className="px-4 py-2">{event.eventOrganization}</td>
                    <td className="px-4 py-2">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{event.eventLocation}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          event.status === "Approved"
                            ? "bg-green-200 text-green-800"
                            : event.status === "Declined"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {event.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <img
                        src={event.eventImage}
                        alt={event.eventName}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleSelectEvent(event)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Approve/Reject Event */}
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-bold text-blue-700 mb-4">
                {selectedEvent.eventName}
              </h2>
              <p>
                <strong>Manager:</strong> {selectedEvent.eventManager}
              </p>
              <p>
                <strong>Organization:</strong> {selectedEvent.eventOrganization}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.eventDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.eventLocation}
              </p>
              <img
                src={selectedEvent.eventImage}
                alt={selectedEvent.eventName}
                className="rounded-md max-w-full max-h-60 object-cover mt-4"
              />

              <div className="mt-6 flex justify-between">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleApproveEvent}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleRejectEvent}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredEventsPage;
