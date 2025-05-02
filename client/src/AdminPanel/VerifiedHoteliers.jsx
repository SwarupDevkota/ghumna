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
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        onClick={() => setSelectedHotelier(hotelier)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                        onClick={() => setEditHotelier({ ...hotelier })}
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                        onClick={() => revertHotelier(hotelier._id)}
                        title="Revert to Pending"
                      >
                        <Trash2 size={18} />
                      </button>
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
      </div>
    </div>
  );
};

export default VerifiedHoteliers;
