import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { X, Printer, Download, Filter, Calendar } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import FeedbackModal from "../ui/FeedbackModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = "http://localhost:3000/api/hotels/requests";

const HotelRequestsPage = () => {
  const [hotelRequests, setHotelRequests] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [decliningHotelId, setDecliningHotelId] = useState(null);
  const [decliningHotelEmail, setDecliningHotelEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    fetchHotelRequests();
  }, []);

  const fetchHotelRequests = async () => {
    try {
      const response = await axios.get(API_URL);
      setHotelRequests(response.data || []);
      setFilteredRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching hotel requests:", error);
      toast.error("Failed to load hotel requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate, hotelRequests]);

  const applyFilters = () => {
    let results = hotelRequests;

    // Filter by hotel name
    if (searchTerm) {
      results = results.filter((request) =>
        request.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      results = results.filter((request) => {
        const requestDate = new Date(request.createdAt);
        return requestDate >= startDate && requestDate <= endDate;
      });
    }

    setFilteredRequests(results);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setFilteredRequests(hotelRequests);
  };

  const openFeedbackModal = (hotelId, email) => {
    setDecliningHotelId(hotelId);
    setDecliningHotelEmail(email);
    setFeedbackMessage("");
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setDecliningHotelId(null);
    setDecliningHotelEmail("");
    setFeedbackMessage("");
  };

  const declineHotel = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/hotels/reject-hotel",
        {
          hotelId: decliningHotelId,
          email: decliningHotelEmail,
          feedback: feedbackMessage,
        }
      );
      toast.success("Hotel rejected successfully!");
      fetchHotelRequests();
      closeFeedbackModal();
    } catch (error) {
      console.error(
        "❌ Reject Hotel API Error:",
        error.response?.data || error.message
      );
      toast.error(
        `Failed to reject hotel: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const approveHotel = async (hotelId, email) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/hotels/approve-hotel",
        {
          hotelId,
          email,
        }
      );
      toast.success("Hotel approved successfully!");
      fetchHotelRequests();
    } catch (error) {
      console.error(
        "❌ Approve Hotel API Error:",
        error.response?.data || error.message
      );
      toast.error(
        `Failed to approve hotel: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const closeModal = () => {
    setSelectedHotel(null);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = document.querySelector(".print-content").outerHTML;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Hotel Requests</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-approved { background-color: #d4edda; color: #155724; }
            .status-declined { background-color: #f8d7da; color: #721c24; }
            .status-pending { background-color: #fff3cd; color: #856404; }
          </style>
        </head>
        <body>
          <h1>Hotel Requests</h1>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRequests.map((request) => ({
        "Hotel Name": request.hotelName,
        "Owner Name": request.ownerName,
        Email: request.email,
        Phone: request.phone,
        Address: request.address,
        Status: request.status || "Pending",
        "Room Types": request.roomTypes?.join(", ") || "N/A",
        "Rooms Available": Object.entries(request.roomsAvailable || {})
          .map(([type, count]) => `${type}: ${count}`)
          .join(", "),
        Prices: Object.entries(request.prices || {})
          .map(([type, price]) => `${type}: ${price}`)
          .join(", "),
        Amenities: request.amenities?.join(", ") || "N/A",
        "Request Date": new Date(request.createdAt).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hotel Requests");
    XLSX.writeFile(workbook, "HotelRequests.xlsx");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hotel Requests</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              <Filter size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-white p-4 rounded-md shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Hotel Name
                </label>
                <input
                  type="text"
                  placeholder="Enter hotel name..."
                  className="w-full p-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Select start date"
                    className="w-full p-2 border rounded-md"
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Select end date"
                    className="w-full p-2 border rounded-md"
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Reset Filters
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-2 text-sm text-gray-600">
          Showing {filteredRequests.length} of {hotelRequests.length} requests
        </div>

        {loading ? (
          <p>Loading hotel requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p>No hotel requests found matching your criteria.</p>
        ) : (
          <div className="print-content bg-white p-4 rounded-md shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Hotel</th>
                  <th className="text-left p-2">Rooms Available</th>
                  <th className="text-left p-2">Request Received Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{request.hotelName}</td>
                    <td className="p-2">
                      {Object.entries(request.roomsAvailable || {})
                        .map(([type, count]) => `${type}: ${count}`)
                        .join(", ")}
                    </td>
                    <td className="p-2">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          request.status === "Approved"
                            ? "status-approved"
                            : request.status === "Declined"
                            ? "status-declined"
                            : "status-pending"
                        }`}
                      >
                        {request.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                        onClick={() => setSelectedHotel(request)}
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

        {/* Enhanced Hotel Details Modal */}
        {selectedHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[85vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl py-4 px-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  {selectedHotel.hotelName}
                </h2>
                <button
                  className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                  onClick={closeModal}
                >
                  <X size={28} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Owner Name:</p>
                    <p className="text-gray-700">{selectedHotel.ownerName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p className="text-gray-700">{selectedHotel.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Phone:</p>
                    <p className="text-gray-700">{selectedHotel.phone}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Address:</p>
                    <p className="text-gray-700">{selectedHotel.address}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Description:</p>
                    <p className="text-gray-700">{selectedHotel.description}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Website:</p>
                    <a
                      href={selectedHotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:underline"
                    >
                      {selectedHotel.website}
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold">Room Types:</p>
                    <p className="text-gray-700">
                      {selectedHotel.roomTypes?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Rooms Available:</p>
                    <p className="text-gray-700">
                      {Object.entries(selectedHotel.roomsAvailable || {})
                        .map(([type, count]) => `${type}: ${count}`)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Prices:</p>
                    <p className="text-gray-700">
                      {Object.entries(selectedHotel.prices || {})
                        .map(([type, price]) => `${type}: ${price}`)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Amenities:</p>
                    <p className="text-gray-700">
                      {selectedHotel.amenities?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Nearby Attractions:</p>
                    <p className="text-gray-700">
                      {selectedHotel.nearbyAttractions?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Images */}
                {selectedHotel.images?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Hotel Images</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedHotel.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Hotel ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedHotel.additionalDocuments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Additional Documents
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedHotel.additionalDocuments.map((doc, idx) => (
                        <img
                          key={idx}
                          src={doc}
                          alt={`Document ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedHotel.hotelRegistrationDocument && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">
                      Registration Document
                    </h3>
                    <img
                      src={selectedHotel.hotelRegistrationDocument}
                      alt="Registration Document"
                      className="w-full h-40 object-cover rounded-lg shadow"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 shadow-md"
                    onClick={() =>
                      approveHotel(selectedHotel._id, selectedHotel.email)
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 shadow-md"
                    onClick={() =>
                      openFeedbackModal(selectedHotel._id, selectedHotel.email)
                    }
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal (Reusable) */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          title="Decline Hotel Request"
          placeholder="Write a reason for rejection..."
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          onClose={closeFeedbackModal}
          onSubmit={declineHotel}
          submitLabel="Send Feedback & Decline"
          submitColor="bg-red-500 hover:bg-red-600"
        />
      </div>
    </div>
  );
};

export default HotelRequestsPage;
