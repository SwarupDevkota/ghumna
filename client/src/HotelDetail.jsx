import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Check } from "lucide-react";

const API_URL = "http://localhost:3000/api/hotels/hotels"; // API base URL

const HotelDetail = () => {
  const { id } = useParams(); // Get the hotel ID from the URL
  const navigate = useNavigate(); // Navigation hook
  const [hotel, setHotel] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch hotel data");
        const result = await response.json();
        setHotel(result.data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleBookNow = () => {
    navigate(`/room-selection/${id}`); // Navigate to the room selection page with the hotelId
  };

  if (loading)
    return <p className="text-center mt-10">Loading hotel details...</p>;
  if (!hotel) return <p className="text-center mt-10">Hotel not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hotel Info */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left Section */}
        <div>
          <h1 className="text-4xl font-bold">
            {hotel.hotelName || "Hotel Name"}
          </h1>
          <div className="flex items-center mt-2">
            <p className="text-xl font-semibold">
              Rs.{" "}
              {hotel.prices ? Object.values(hotel.prices)[0] || "N/A" : "N/A"} /
              night
            </p>
            <div className="ml-4 flex items-center text-yellow-500">
              <Star size={18} /> {hotel.rating || "4.5"}
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            {hotel.description || "No description available."}
          </p>
          <div className="mt-4 flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>{hotel.address || "Unknown location"}</span>
          </div>
        </div>

        {/* Right Section - Image Gallery */}
        <div>
          <img
            src={
              hotel.images?.[activeImage]
                ? hotel.images[activeImage]
                : "https://via.placeholder.com/400"
            }
            alt="Hotel"
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="mt-2 flex space-x-2">
            {hotel.images?.length > 0 ? (
              hotel.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Thumbnail"
                  className={`h-20 w-32 object-cover rounded-lg cursor-pointer border-2 ${
                    activeImage === index
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                />
              ))
            ) : (
              <p className="text-gray-500">No images available</p>
            )}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
          {hotel.amenities?.length > 0 ? (
            hotel.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <Check size={18} className="text-green-500" />
                <span className="ml-2">{amenity}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No amenities available</p>
          )}
        </div>
      </div>

      {/* Payment Options */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Payment Options</h2>
        <div className="flex gap-4">
          {hotel.paymentOptions?.length > 0 ? (
            hotel.paymentOptions.map((option, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
              >
                {option}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No payment options available</p>
          )}
        </div>
      </div>

      {/* Book Now Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleBookNow}
          className="px-6 py-3 bg-[#E3A726] text-white font-medium rounded-lg hover:bg-[#D29C1F] transition transform hover:scale-105"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default HotelDetail;
