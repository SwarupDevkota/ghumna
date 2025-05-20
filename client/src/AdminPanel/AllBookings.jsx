import React, { useState, useEffect } from "react";
import { Loader2, X, Eye, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/booking/all-bookings`,
          {
            params: {
              page: currentPage,
              limit: itemsPerPage,
            },
          }
        );
        setBookings(response.data.allBookings || []);
        setTotalItems(response.data.totalCount || 0);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, itemsPerPage]);

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-200 text-green-800";
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Failed":
        return "bg-red-200 text-red-800";
      default:
        return "bg-blue-200 text-blue-800";
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Content */}
        <main
          className="flex-1 overflow-y-auto p-6 transition-all duration-300"
          style={{
            marginLeft: isSidebarOpen ? "5rem" : "1rem",
            paddingBottom: "6rem", // Extra space for footer
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-blue-700">All Bookings</h1>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Show loading, error, or data */}
          {loading ? (
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="animate-spin" size={24} />
              <span>Loading bookings...</span>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-gray-600">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-md">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Room Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking._id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.user?.name || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {booking.rooms?.map((room, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-200 text-blue-800 rounded mr-1 text-xs"
                          >
                            {room.type}
                          </span>
                        )) || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <span className="font-medium">Check-In: </span>
                          {booking.checkInDate
                            ? new Date(booking.checkInDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Check-Out: </span>
                          {booking.checkOutDate
                            ? new Date(
                                booking.checkOutDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {booking.numberOfGuests}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        Rs. {booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded text-xs bg-green-200 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center"
                          onClick={() => showBookingDetails(booking)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalItems)}
                        </span>{" "}
                        of <span className="font-medium">{totalItems}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        {getPageNumbers().map((number) => (
                          <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === number
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {number}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal for Booking Details */}
          {isModalOpen && selectedBooking && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-blue-700 mb-4">
                  Booking Details
                </h2>
                <div className="space-y-3">
                  <p>
                    <strong>Booking ID:</strong> {selectedBooking._id}
                  </p>
                  <p>
                    <strong>Guest Name:</strong>{" "}
                    {selectedBooking.user?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Guest Email:</strong>{" "}
                    {selectedBooking.user?.email || "N/A"}
                  </p>
                  <div>
                    <strong>Room Details:</strong>
                    {selectedBooking.rooms?.map((room, index) => (
                      <div
                        key={index}
                        className="mt-2 pl-4 border-l-2 border-blue-200"
                      >
                        <h4 className="font-medium">Room {index + 1}</h4>
                        <p>
                          <strong>Type:</strong> {room.type}
                        </p>
                        <p>
                          <strong>Price:</strong> Rs. {room.price}
                        </p>
                        <p>
                          <strong>Max Guests:</strong> {room.maxGuests}
                        </p>
                        <p>
                          <strong>Description:</strong> {room.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p>
                    <strong>Check-In Date:</strong>{" "}
                    {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Check-Out Date:</strong>{" "}
                    {new Date(
                      selectedBooking.checkOutDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Number of Guests:</strong>{" "}
                    {selectedBooking.numberOfGuests}
                  </p>
                  <p>
                    <strong>Total Price:</strong>{" "}
                    <span className="font-bold text-blue-600">
                      Rs. {selectedBooking.totalPrice.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span className="px-2 py-1 rounded bg-green-200 text-green-800">
                      Paid
                    </span>
                  </p>

                  <p>
                    <strong>Special Requests:</strong>{" "}
                    {selectedBooking.specialRequests || "None"}
                  </p>
                  <p>
                    <strong>Booking Date:</strong>{" "}
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Hotel Management System
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AllBookings;
