import React, { useEffect, useState } from "react";
import {
  Loader2,
  Eye,
  Pencil,
  Trash2,
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
import Sidebar from "./Sidebar";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HotelierDetailsModal from "./HotelierDetailsModal";
import EditHotelierModal from "./EditHotelierModal";
import { motion, AnimatePresence } from "framer-motion";

const VerifiedHoteliers = () => {
  const [hoteliers, setHoteliers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotelier, setSelectedHotelier] = useState(null);
  const [editHotelier, setEditHotelier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHoteliers, setFilteredHoteliers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchApprovedHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate, hoteliers]);

  const fetchApprovedHotels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/hotels/approved-hotels"
      );
      const mappedHoteliers = response.data.data.map((hotel) => ({
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
        registrationDocument: hotel.registrationDocument || "",
        additionalDocuments: hotel.additionalDocuments || [],
        images: hotel.images || [],
        roomTypes: hotel.roomTypes || [],
        status: hotel.status || "Approved",
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
      }));
      setHoteliers(mappedHoteliers);
      setFilteredHoteliers(mappedHoteliers);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching approved hotels:", error);
      setError("Failed to fetch approved hotels.");
      toast.error("Failed to fetch approved hotels.");
    }
  };

  const closeModal = () => {
    setSelectedHotelier(null);
  };

  const applyFilters = () => {
    let results = hoteliers;

    if (searchTerm) {
      results = results.filter((hotelier) =>
        hotelier.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      results = results.filter((hotelier) => {
        const approvalDate = new Date(hotelier.updatedAt);
        return approvalDate >= startDate && approvalDate <= endDate;
      });
    }

    setFilteredHoteliers(results);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setFilteredHoteliers(hoteliers);
  };

  const revertHotelier = async (hotelId) => {
    if (
      !window.confirm(
        "Are you sure you want to revert this hotelier back to Pending?"
      )
    )
      return;

    try {
      await axios.put(
        `http://localhost:3000/api/hotels/revert-hotelier/${hotelId}`
      );
      toast.success("Hotelier status reverted to Pending!");
      fetchApprovedHotels();
    } catch (error) {
      console.error("❌ Error reverting hotelier:", error);
      toast.error("Failed to revert hotelier.");
    }
  };

  const updateHotelier = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/hotels/edit-hotelier/${editHotelier._id}`,
        editHotelier
      );
      toast.success("Hotelier updated successfully!");
      fetchApprovedHotels();
      setEditHotelier(null);
    } catch (error) {
      console.error("❌ Error updating hotelier:", error);
      toast.error("Failed to update hotelier.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = document.querySelector(".print-content").outerHTML;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Verified Hoteliers</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #2563eb; margin-bottom: 10px; }
            p { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Verified Hoteliers</h1>
          <p>List of all hoteliers that have been verified.</p>
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
      filteredHoteliers.map((hotelier) => ({
        "Owner Name": hotelier.ownerName,
        "Hotel Name": hotelier.hotelName,
        Email: hotelier.email,
        Phone: hotelier.phone,
        Address: hotelier.address,
        "Approval Date": new Date(hotelier.updatedAt).toLocaleDateString(),
        Description: hotelier.description,
        Website: hotelier.website,
        "Room Types": hotelier.roomTypes?.join(", ") || "N/A",
        Amenities: hotelier.amenities?.join(", ") || "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Verified Hoteliers");
    XLSX.writeFile(workbook, "VerifiedHoteliers.xlsx");
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
    const currentHotelier = filteredHoteliers.find((hotelier) =>
      hotelier.images.includes(selectedImage.src)
    );
    if (!currentHotelier) return;

    const totalImages = currentHotelier.images.length;
    let newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % totalImages
        : (currentImageIndex - 1 + totalImages) % totalImages;

    setCurrentImageIndex(newIndex);
    setSelectedImage({
      src: currentHotelier.images[newIndex],
      rotate: 0,
      flip: null,
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div
        className={`flex-grow p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-5" : "ml-16"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">
              Verified Hoteliers
            </h2>
            <p>List of all hoteliers that have been verified.</p>
          </div>
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
          Showing {filteredHoteliers.length} of {hoteliers.length} hoteliers
        </div>

        {isLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading hoteliers...</span>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredHoteliers.length === 0 ? (
          <p className="text-gray-600">
            No hoteliers found matching your criteria.
          </p>
        ) : (
          <div className="overflow-x-auto print-content">
            <table className="table-auto w-full border border-gray-300 shadow-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Hotel Name</th>
                  <th className="px-4 py-2 text-left">Owner</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">Room Types</th>
                  <th className="px-4 py-2 text-left">Amenities</th>
                  <th className="px-4 py-2 text-left">Images</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoteliers.map((hotelier) => (
                  <tr key={hotelier._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">
                      <div className="font-medium">{hotelier.hotelName}</div>
                      <div className="text-sm text-gray-600">
                        {hotelier.address}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div>{hotelier.ownerName}</div>
                      <div className="text-sm text-gray-600">
                        {hotelier.email}
                      </div>
                    </td>
                    <td className="px-4 py-2">{hotelier.phone}</td>
                    <td className="px-4 py-2">
                      {hotelier.roomTypes?.join(", ") || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {hotelier.amenities?.join(", ") || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {hotelier.images.length > 0 ? (
                        <div className="flex gap-2">
                          {hotelier.images.slice(0, 3).map((image, index) => (
                            <motion.img
                              key={index}
                              src={image}
                              alt={`${hotelier.hotelName} image ${index + 1}`}
                              className="w-12 h-12 object-cover rounded cursor-pointer"
                              onClick={() => openImageModal(image, index)}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            />
                          ))}
                          {hotelier.images.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{hotelier.images.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <motion.button
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        onClick={() => setSelectedHotelier(hotelier)}
                        title="View Details"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye size={18} />
                      </motion.button>
                      <motion.button
                        className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                        onClick={() => setEditHotelier({ ...hotelier })}
                        title="Edit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Pencil size={18} />
                      </motion.button>
                      <motion.button
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                        onClick={() => revertHotelier(hotelier._id)}
                        title="Revert to Pending"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Modal */}
        <HotelierDetailsModal
          selectedHotelier={selectedHotelier}
          onClose={closeModal}
        />

        {/* Edit Modal */}
        <EditHotelierModal
          editHotelier={editHotelier}
          setEditHotelier={setEditHotelier}
          updateHotelier={updateHotelier}
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

export default VerifiedHoteliers;
