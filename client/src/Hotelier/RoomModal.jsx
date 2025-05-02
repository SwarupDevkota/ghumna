import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import { AppContent } from "../context/AppContext";

const RoomModal = ({ isOpen, onClose, onSubmit, editingRoom }) => {
  const { userData } = useContext(AppContent);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const roomTypes = ["Single", "Double", "Suite", "Deluxe", "Family", "King"];

  const [roomData, setRoomData] = useState({
    roomCount: editingRoom?.roomCount || "",
    type: editingRoom?.type || "",
    price: editingRoom?.price || "",
    maxGuests: editingRoom?.maxGuests || "",
    description: editingRoom?.description || "",
    image: null,
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
    } else {
      setPreviewImage(editingRoom?.images?.[0] || null);
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
      !roomData.roomCount ||
      !roomData.type ||
      !roomData.price ||
      !roomData.maxGuests
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = editingRoom?.images?.[0] || null;
      if (roomData.image) {
        imageUrl = await uploadImageToCloudinary(roomData.image);
        if (!imageUrl) {
          alert("Failed to upload image.");
          return;
        }
      }

      const formData = {
        roomCount: roomData.roomCount,
        type: roomData.type,
        price: roomData.price,
        maxGuests: roomData.maxGuests,
        description: roomData.description,
        image: imageUrl,
        hotelId: userData.ownedHotel,
      };

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingRoom ? "Edit Room" : "Add New Room"}
          </h3>
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
            name="roomCount"
            placeholder="Room Count (i.e.Number of rooms available)"
            value={roomData.roomCount}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="type"
            value={roomData.type}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
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
            placeholder="Price per night"
            value={roomData.price}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
            min="0"
          />

          <input
            type="number"
            name="maxGuests"
            placeholder="Maximum Guests"
            value={roomData.maxGuests}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
            min="1"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {(previewImage || editingRoom?.images?.[0]) && (
            <img
              src={previewImage || editingRoom.images[0]}
              alt="Preview"
              className="h-32 w-full object-contain rounded-lg border"
            />
          )}

          <textarea
            name="description"
            placeholder="Room description and amenities"
            value={roomData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isUploading}
          >
            {isUploading
              ? "Processing..."
              : editingRoom
              ? "Update"
              : "Add Room"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
