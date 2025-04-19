import React, { useContext, useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import RoomModal from "./RoomModal";
import { AppContent } from "../context/AppContext";
import HotelSidebar from "./HotelSidebar";

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const { userData } = useContext(AppContent);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (userData?.email) {
      const fetchRoomDetails = async () => {
        try {
          console.log("📤 Fetching rooms for email:", userData.email);

          const response = await fetch(
            "http://localhost:3000/api/room-details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: userData.email }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Failed to fetch room details:", errorData);
            throw new Error(
              errorData.message || "Failed to fetch room details."
            );
          }

          const data = await response.json();
          console.log("✅ Room details received:", data);
          setRooms(data.rooms || []);
        } catch (error) {
          console.error("❌ Error fetching room details:", error);
        }
      };

      fetchRoomDetails();
    }
  }, [userData?.email]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addRoom = async (formData) => {
    formData.append("email", userData.email);

    console.log(
      "📤 Sending data to backend:",
      Object.fromEntries(formData.entries())
    );

    try {
      const response = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save room data.");

      const responseData = await response.json();
      console.log("✅ Server Response:", responseData);

      setRooms([...rooms, responseData.room]);

      alert("Room added successfully!");
    } catch (error) {
      console.error("❌ Error adding room:", error);
      alert("Failed to add room.");
    }
  };

  return (
    <div className="flex">
      <HotelSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className={`p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Room Management</h2>
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Room
          </button>
        </div>

        <RoomModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={addRoom}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Image</th>
                <th className="px-4 py-2 border-b">Room Count</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Max Guests</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td className="px-4 py-2 border-b">
                    <img
                      src={room.image}
                      alt={`Room ${room.roomCount}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{room.roomCount}</td>
                  <td className="px-4 py-2 border-b">{room.type}</td>
                  <td className="px-4 py-2 border-b">{room.status}</td>
                  <td className="px-4 py-2 border-b">{room.price}</td>
                  <td className="px-4 py-2 border-b">{room.maxGuests}</td>
                  <td className="px-4 py-2 border-b">{room.description}</td>
                  <td className="px-4 py-2 border-b">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 ml-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
