import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  Printer,
  Download,
  Filter,
  Calendar,
  RotateCw,
  FlipHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import FeedbackModal from "../ui/FeedbackModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HotelierDetailsModal from "./HotelierDetailsModal";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:3000/api/hotels";

const HotelRequestsPage = () => {
  const [hotelRequests, setHotelRequests] = useState([]);
  const [selectedHotelier, setSelectedHotelier] = useState(null);
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchHotelRequests();
  }, []);

  const fetchHotelRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests`);
      const mappedRequests = response.data.data.map((hotel) => ({
        _id: hotel._id,
        hotelName: hotel.name,
        ownerName: hotel.owner?.name || "Unknown",
        email: hotel.email,
        phone: hotel.phone,
        address: hotel.address,
        description: hotel.description || "N/A",
        website: hotel.website || "N/A",
        amenities: hotel.amenities || [],
        nearbyAttractions: hotel.nearbyAttractions || [],
        hotelRegistrationDocument: hotel.registrationDocument || "",
        additionalDocuments: hotel.additionalDocuments || [],
        images: hotel.images || [],
        roomTypes: hotel.roomTypes || [],
        status: hotel.status || "Pending",
        createdAt: hotel.createdAt,
      }));
      setHotelRequests(mappedRequests);
      setFilteredRequests(mappedRequests);
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

    if (searchTerm) {
      results = results.filter((request) =>
        request.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
    setSelectedHotelier(null);
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
        Status: request.status,
        "Room Types": request.roomTypes?.join(", ") || "N/A",
        Amenities: request.amenities?.join(", ") || "N/A",
        "Request Date": new Date(request.createdAt).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hotel Requests");
    XLSX.writeFile(workbook, "HotelRequests.xlsx");
  };

  const openImageModal = (image, index) => {
    setSelectedImage({ src: image, rotate: 0, flip: null });
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `hotel_image_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rotateImage = () => {
    if (selectedImage) {
      setSelectedImage((prev) => ({
        ...prev,
        rotate: (prev.rotate || 0) + 90,
      }));
    }
  };

  const flipImage = () => {
    if (selectedImage) {
      setSelectedImage((prev) => ({
        ...prev,
        flip: prev.flip === "horizontal" ? "vertical" : "horizontal",
      }));
    }
  };

  const switchImage = (direction) => {
    const currentRequest = filteredRequests.find((request) =>
      request.images.includes(selectedImage.src)
    );
    if (!currentRequest) return;

    const totalImages = currentRequest.images.length;
    let newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % totalImages
        : (currentImageIndex - 1 + totalImages) % totalImages;

    setCurrentImageIndex(newIndex);
    setSelectedImage({
      src: currentRequest.images[newIndex],
      rotate: 0,
      flip: null,
    });
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
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </motion.button>
            <motion.button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Printer size={16} />
              Print
            </motion.button>
            <motion.button
              onClick={exportToExcel}
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={16} />
              Excel
            </motion.button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <motion.div
            className="bg-white p-4 rounded-md shadow mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              <motion.button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Filters
              </motion.button>
              <motion.button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
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
          <motion.div
            className="print-content bg-white p-4 rounded-md shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Hotel</th>
                  <th className="text-left p-2">Room Types</th>
                  <th className="text-left p-2">Request Received Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Images</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="border-b">
                    <td className="p-2">{request.hotelName}</td>
                    <td className="p-2">
                      {request.roomTypes?.join(", ") || "N/A"}
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
                        {request.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {request.images.length > 0 ? (
                        <div className="flex gap-2">
                          {request.images.slice(0, 3).map((image, index) => (
                            <motion.img
                              key={index}
                              src={image}
                              alt={`${request.hotelName} image ${index + 1}`}
                              className="w-12 h-12 object-cover rounded cursor-pointer"
                              onClick={() => openImageModal(image, index)}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            />
                          ))}
                          {request.images.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{request.images.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-2">
                      <motion.button
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                        onClick={() => setSelectedHotelier(request)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Select
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Hotel Details Modal */}
        <HotelierDetailsModal
          selectedHotelier={selectedHotelier}
          onClose={closeModal}
          onApprove={approveHotel}
          onDecline={openFeedbackModal}
        />

        {/* Feedback Modal */}
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

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative bg-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={selectedImage.src}
                  alt="Selected hotel image"
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  style={{
                    transform: `rotate(${selectedImage.rotate || 0}deg) ${
                      selectedImage.flip === "horizontal"
                        ? "scaleX(-1)"
                        : selectedImage.flip === "vertical"
                        ? "scaleY(-1)"
                        : ""
                    }`,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <div className="flex justify-center gap-4 mt-4">
                  <motion.button
                    onClick={() => switchImage("prev")}
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <motion.button
                    onClick={() => switchImage("next")}
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                  <motion.button
                    onClick={rotateImage}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCw size={24} />
                  </motion.button>
                  <motion.button
                    onClick={flipImage}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FlipHorizontal size={24} />
                  </motion.button>
                  <motion.button
                    onClick={() => downloadImage(selectedImage.src)}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={24} />
                  </motion.button>
                  <motion.button
                    onClick={closeImageModal}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HotelRequestsPage;
