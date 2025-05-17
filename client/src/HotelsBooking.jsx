import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Search, X, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { message } from "antd";

const API_URL = "http://localhost:3000/api/hotels/approved-hotels";

const BookingsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [filters, setFilters] = useState({ location: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hotelsContainerRef = useRef(null);

  // Parallax and scroll effects
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const yTransform = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();
      setHotels(data.data || []);
      setFilteredHotels(data.data || []);
      message.success("Hotels loaded successfully!");
    } catch (error) {
      message.error("Error fetching hotels. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = hotels;
    if (filters.location) {
      filtered = filtered.filter((hotel) =>
        hotel.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    setFilteredHotels(filtered);

    if (filtered.length === 0) {
      message.info("No hotels match your filters.");
    } else {
      message.success(
        `Found ${filtered.length} hotels matching your criteria.`
      );
    }
  };

  const resetFilters = () => {
    setFilters({ location: "" });
    setFilteredHotels(hotels);
    message.info("Filters have been reset.");
  };

  const viewHotelData = (hotelId) => {
    navigate(`/hotel-detail/${hotelId}`);
  };

  const scrollToHotels = () => {
    hotelsContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Hero Section with Parallax Effect */}
      <motion.div
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
        <motion.div
          className="text-center z-10 px-4"
          style={{ opacity, y: yTransform }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Find Your Perfect Stay
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            Discover handpicked hotels that combine comfort, luxury, and
            unforgettable experiences for your next adventure.
          </motion.p>
          <motion.button
            onClick={scrollToHotels}
            className="px-8 py-4 bg-[#E3A726] text-white font-semibold rounded-full hover:bg-[#D29C1F] transition-all duration-300 flex items-center mx-auto shadow-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(227, 167, 38, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            Explore Hotels{" "}
            <ChevronDown className="ml-2 animate-bounce" size={20} />
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-10">
        {/* Search Section */}
        <motion.div
          className="mb-16 bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Search by location (e.g. Kathmandu)"
              className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 text-lg"
              value={filters.location}
              onChange={handleFilterChange}
            />
            {filters.location && (
              <motion.button
                onClick={resetFilters}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            )}
          </div>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <motion.button
              className="px-8 py-3 bg-[#E3A726] text-white font-semibold rounded-xl hover:bg-[#D29C1F] transition-all duration-300 shadow-md"
              onClick={applyFilters}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(227, 167, 38, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Search Hotels
            </motion.button>
          </div>
        </motion.div>

        {/* Hotels Grid Section */}
        <div ref={hotelsContainerRef}>
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Discover Amazing Places
          </motion.h2>

          {loading ? (
            <motion.div
              className="flex justify-center items-center p-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E3A726] border-t-transparent"></div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, index) => (
                  <motion.div
                    key={hotel._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={
                          hotel.images?.[0] ?? "https://via.placeholder.com/300"
                        }
                        alt={hotel.hotelName}
                        className="w-full h-64 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center shadow-lg"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Star
                          size={16}
                          className="text-yellow-500"
                          fill="#F59E0B"
                        />
                        <span className="ml-1 font-bold text-gray-800">
                          {hotel.rating || "4.5"}
                        </span>
                      </motion.div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#E3A726] transition-colors duration-300">
                        {hotel.hotelName}
                      </h3>
                      <motion.p
                        className="text-gray-600 leading-relaxed mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {hotel.description?.slice(0, 100)}...
                      </motion.p>

                      <motion.div
                        className="flex items-center mb-4 text-gray-600"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <MapPin size={18} className="mr-2 text-[#E3A726]" />
                        <span>{hotel.address}</span>
                      </motion.div>

                      <motion.div
                        className="flex flex-wrap gap-2 mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                          <motion.span
                            key={index}
                            className="px-4 py-1.5 bg-yellow-50 text-[#E3A726] text-sm font-medium rounded-full"
                            whileHover={{
                              scale: 1.05,
                              backgroundColor: "#FEF9C3",
                            }}
                          >
                            {amenity}
                          </motion.span>
                        ))}
                        {hotel.amenities?.length > 3 && (
                          <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </motion.div>

                      <motion.div
                        className="flex items-center justify-between pt-4 border-t border-gray-100"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <div className="text-[#E3A726]">
                          <span className="text-2xl font-bold">
                            Rs. {Object.values(hotel.prices || {})[0] || "200"}
                          </span>
                          <span className="text-gray-600 text-sm">/night</span>
                        </div>
                        <motion.button
                          onClick={() => viewHotelData(hotel._id)}
                          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-[#E3A726] transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                    <p className="text-xl text-gray-600 mb-6">
                      No hotels match your search criteria.
                    </p>
                    <motion.button
                      onClick={resetFilters}
                      className="px-8 py-3 bg-[#E3A726] text-white font-semibold rounded-xl hover:bg-[#D29C1F] transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset Search
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
