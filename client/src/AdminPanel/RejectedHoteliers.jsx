import React, { useEffect, useState } from "react";
import { Loader2, Eye, Pencil, Trash2, X } from "lucide-react";
import Sidebar from "./Sidebar";
import axios from "axios";

const RejectedHoteliers = () => {
  const [hoteliers, setHoteliers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotelier, setSelectedHotelier] = useState(null);
  const [editHotelier, setEditHotelier] = useState(null);

  useEffect(() => {
    fetchDeclinedHotels();
  }, []);

  const fetchDeclinedHotels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/hotels/declined-hotels"
      );
      setHoteliers(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching approved hotels:", error);
      setError("Failed to fetch approved hotels.");
    }
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
      alert("Hotelier status reverted to Pending!");
      fetchApprovedHotels();
    } catch (error) {
      console.error("❌ Error reverting hotelier:", error);
      alert("Failed to revert hotelier.");
    }
  };

  const updateHotelier = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/hotels/edit-hotelier/${editHotelier._id}`,
        editHotelier
      );
      alert("Hotelier updated successfully!");
      fetchApprovedHotels();
      setEditHotelier(null);
    } catch (error) {
      console.error("❌ Error updating hotelier:", error);
      alert("Failed to update hotelier.");
    }
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
        <h2 className="text-2xl font-bold text-blue-700">Rejected Hoteliers</h2>
        <p>List of all hoteliers that have been rejected.</p>

        {isLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading hoteliers...</span>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : hoteliers.length === 0 ? (
          <p className="text-gray-600">No rejected hoteliers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 shadow-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Hotelier Name</th>
                  <th className="px-4 py-2 text-left">Hotel Name</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hoteliers.map((hotelier) => (
                  <tr key={hotelier._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{hotelier.ownerName}</td>
                    <td className="px-4 py-2">{hotelier.hotelName}</td>
                    <td className="px-4 py-2">{hotelier.address}</td>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <h2 className="text-xl font-bold mb-4">
                {selectedHotelier.hotelName}
              </h2>
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
                <strong>Website:</strong> {selectedHotelier.website}
              </p>
              <p>
                <strong>Rooms Available:</strong>{" "}
                {selectedHotelier.roomsAvailable}
              </p>
              <p>
                <strong>RoomTypes:</strong>{" "}
                {selectedHotelier.roomTypes?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Prices:</strong>{" "}
                {selectedHotelier.prices?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Amenities:</strong>{" "}
                {selectedHotelier.amenities?.join(", ") || "N/A"}{" "}
              </p>
              <p>
                <strong>Nearby Attractions:</strong>{" "}
                {selectedHotelier.nearbyAttractions}
              </p>
              <p>
                <strong>Hotel Registration Document:</strong>{" "}
                {/* Hotel Registration Document */}
                {selectedHotelier.hotelRegistrationDocument ? (
                  <img
                    src={`http://localhost:3000/${selectedHotelier.hotelRegistrationDocument}`}
                    alt="Hotel Registration Document"
                    className="w-40 h-auto border rounded-md mb-2"
                  />
                ) : (
                  <p>No document uploaded</p>
                )}
              </p>
              {/* Additional Documents */}
              {selectedHotelier.additionalDocuments?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Additional Documents
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedHotelier.additionalDocuments.map((doc, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:3000/${doc}`}
                        alt={`Document ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/100")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Hotel Images */}
              {selectedHotelier.images?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Hotel Images</h3>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedHotelier.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:3000/${img}`}
                        alt={`Hotel ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/100")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              <p>
                <strong>payment Options:</strong>{" "}
                {selectedHotelier.paymentOptions?.join(", ") || "N/A"}{" "}
              </p>

              <button
                onClick={() => setSelectedHotelier(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editHotelier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <h2 className="text-xl font-bold mb-4">Edit Hotelier</h2>
              <form onSubmit={updateHotelier} className="space-y-4">
                {/* Hotel Name */}
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

                {/* Owner Name */}
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

                {/* Email */}
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

                {/* Phone */}
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

                {/* Address */}
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

                {/* Description */}
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

                {/* Website */}
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

                {/* Rooms Available */}
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

                {/* Room Types (Array of Strings) */}
                <input
                  type="text"
                  name="roomTypes"
                  value={editHotelier.roomTypes.join(", ")}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      roomTypes: e.target.value.split(", "),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Room Types (comma-separated)"
                />

                {/* Prices (Object with Room Types) */}
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

                {/* Amenities (Array) */}
                <input
                  type="text"
                  name="amenities"
                  value={editHotelier.amenities.join(", ")}
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      amenities: e.target.value.split(", "),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Amenities (comma-separated)"
                />

                {/* Nearby Attractions */}
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

                {/* Upload Hotel Registration Document */}
                <label className="block">Hotel Registration Document:</label>
                {editHotelier.hotelRegistrationDocument && (
                  <img
                    src={editHotelier.hotelRegistrationDocument}
                    alt="Hotel Registration"
                    className="w-40 h-auto border rounded-md mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditHotelier({
                      ...editHotelier,
                      hotelRegistrationDocument: URL.createObjectURL(
                        e.target.files[0]
                      ),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                {/* Save Button */}
                <button
                  type="submit"
                  className="bg-green-600 text-white p-2 rounded-md w-full"
                >
                  Save Changes
                </button>
              </form>

              {/* Close Button */}
              <button
                onClick={() => setEditHotelier(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectedHoteliers;
