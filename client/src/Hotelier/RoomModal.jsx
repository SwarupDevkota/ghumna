import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import { AppContent } from "../context/AppContext";

const RoomModal = ({ isOpen, onClose, onSubmit }) => {
  const { userData } = useContext(AppContent);
  const [previewImage, setPreviewImage] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Family", "King"];

  const [roomData, setRoomData] = useState({
    count: "",
    type: "",
    status: "Available",
    price: "",
    guests: "",
    image: null,
    description: "",
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRoomData({ ...roomData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (
      !roomData.count ||
      !roomData.type ||
      !roomData.price ||
      !roomData.guests
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    let image = null;
    if (roomData.image) {
      image = await uploadImageToCloudinary(roomData.image);
      if (!image) {
        alert("Failed to upload image.");
        return;
      }
    }

    const roomPayload = {
      roomCount: roomData.count,
      type: roomData.type,
      status: roomData.status,
      price: roomData.price,
      guests: roomData.guests,
      description: roomData.description,
      image,
      email: userData.email,
    };

    try {
      const response = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("🚨 Server Error:", responseData);
        throw new Error("Failed to save room data.");
      }

      alert("Room added successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error adding room:", error);
      alert("Failed to add room.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Room</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            name="count"
            placeholder="Room Count"
            value={roomData.count}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="type"
            value={roomData.type}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Room Type</option>
            {roomTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={roomData.price}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="guests"
            placeholder="Guest Capacity"
            value={roomData.guests}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="h-20 w-full object-cover rounded-lg"
            />
          )}
          <textarea
            name="description"
            placeholder="Description"
            value={roomData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
