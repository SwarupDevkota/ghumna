import React, { useEffect, useState } from "react";
import {
  Loader2,
  Eye,
  Pencil,
  Trash2,
  X,
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
      setHoteliers(response.data.data);
      setFilteredHoteliers(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching approved hotels:", error);
      setError("Failed to fetch approved hotels.");
      toast.error("Failed to fetch approved hotels.");
    }
  };

  const applyFilters = () => {
    let results = hoteliers;

    // Filter by hotel name
    if (searchTerm) {
      results = results.filter((hotelier) =>
        hotelier.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
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
        "Rooms Available": hotelier.roomsAvailable,
        "Room Types": hotelier.roomTypes?.join(", ") || "N/A",
        Amenities: hotelier.amenities?.join(", ") || "N/A",
        "Nearby Attractions": hotelier.nearbyAttractions,
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
                  <th className="px-4 py-2 text-left">Hotelier Name</th>
                  <th className="px-4 py-2 text-left">Hotel Name</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Approval Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoteliers.map((hotelier) => (
                  <tr key={hotelier._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{hotelier.ownerName}</td>
                    <td className="px-4 py-2">{hotelier.hotelName}</td>
                    <td className="px-4 py-2">{hotelier.address}</td>
                    <td className="px-4 py-2">
                      {new Date(hotelier.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        onClick={() => setSelectedHotelier(hotelier)}
                      >
                        <Eye size={20} />
                        <span>View</span>
                      </button>

                      <button
                        className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                        onClick={() => setEditHotelier(hotelier)}
                      >
                        <Pencil size={20} />
                        <span>Edit</span>
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                        onClick={() => revertHotelier(hotelier._id)}
                      >
                        <Trash2 size={20} />
                        <span>Revert to Pending</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Modal */}
        {selectedHotelier && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-2xl py-4 px-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  {selectedHotelier.hotelName}
                </h2>
                <button
                  className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                  onClick={() => setSelectedHotelier(null)}
                >
                  <X size={28} />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p>
                    <strong>Owner:</strong> {selectedHotelier.ownerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedHotelier.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedHotelier.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedHotelier.address}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedHotelier.description}
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={selectedHotelier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:underline"
                    >
                      {selectedHotelier.website}
                    </a>
                  </p>
                  <p>
                    <strong>Rooms Available:</strong>{" "}
                    {selectedHotelier.roomsAvailable}
                  </p>
                  <p>
                    <strong>Room Types:</strong>{" "}
                    {selectedHotelier.roomTypes?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Prices:</strong>{" "}
                    {selectedHotelier.prices?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Amenities:</strong>{" "}
                    {selectedHotelier.amenities?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Nearby Attractions:</strong>{" "}
                    {selectedHotelier.nearbyAttractions}
                  </p>
                  <p>
                    <strong>Payment Options:</strong>{" "}
                    {selectedHotelier.paymentOptions?.join(", ") || "N/A"}
                  </p>
                </div>

                {/* Hotel Registration Document */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Hotel Registration Document
                  </h3>
                  {selectedHotelier.hotelRegistrationDocument ? (
                    <img
                      src={`http://localhost:3000/${selectedHotelier.hotelRegistrationDocument}`}
                      alt="Hotel Registration Document"
                      className="w-full h-auto border rounded-lg shadow-md mt-2"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />
                  ) : (
                    <p className="text-gray-500">No document uploaded</p>
                  )}
                </div>

                {/* Additional Documents */}
                {selectedHotelier.additionalDocuments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold">
                      Additional Documents
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {selectedHotelier.additionalDocuments.map((doc, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:3000/${doc}`}
                          alt={`Document ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotel Images */}
                {selectedHotelier.images?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold">Hotel Images</h3>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {selectedHotelier.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:3000/${img}`}
                          alt={`Hotel ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedHotelier(null)}
                  className="mt-6 w-full bg-gray-500 text-white py-2 rounded-full hover:bg-gray-600 shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editHotelier && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-2xl py-4 px-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  Edit Hotelier
                </h2>
                <button
                  className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                  onClick={() => setEditHotelier(null)}
                >
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={updateHotelier} className="p-6 space-y-4">
                <input
                  type="text"
                  name="hotelName"
                  value={editHotelier.hotelName}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      hotelName: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Hotel Name"
                  required
                />

                <input
                  type="text"
                  name="ownerName"
                  value={editHotelier.ownerName}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      ownerName: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Owner Name"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={editHotelier.email}
                  onChange={(e) =>
                    setEditHotelier({ ...editHotelier, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Email"
                  required
                />

                <input
                  type="text"
                  name="phone"
                  value={editHotelier.phone}
                  onChange={(e) =>
                    setEditHotelier({ ...editHotelier, phone: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Phone"
                />

                <input
                  type="text"
                  name="address"
                  value={editHotelier.address}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Address"
                />

                <textarea
                  name="description"
                  value={editHotelier.description}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Description"
                ></textarea>

                <input
                  type="text"
                  name="website"
                  value={editHotelier.website}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      website: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Website URL"
                />

                <input
                  type="number"
                  name="roomsAvailable"
                  value={editHotelier.roomsAvailable}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      roomsAvailable: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Rooms Available"
                />

                <input
                  type="text"
                  name="roomTypes"
                  value={editHotelier.roomTypes?.join(", ")}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      roomTypes: e.target.value.split(", "),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Room Types (comma-separated)"
                />

                <input
                  type="text"
                  name="prices"
                  value={JSON.stringify(editHotelier.prices)}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      prices: JSON.parse(e.target.value || "{}"),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Prices (JSON Format)"
                />

                <input
                  type="text"
                  name="amenities"
                  value={editHotelier.amenities?.join(", ")}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      amenities: e.target.value.split(", "),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Amenities (comma-separated)"
                />

                <input
                  type="text"
                  name="nearbyAttractions"
                  value={editHotelier.nearbyAttractions}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      nearbyAttractions: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nearby Attractions"
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white p-2 rounded-full w-full hover:bg-green-700 shadow-md"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setEditHotelier(null)}
                  className="bg-gray-500 text-white p-2 rounded-full w-full hover:bg-gray-600 shadow-md"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedHoteliers;
