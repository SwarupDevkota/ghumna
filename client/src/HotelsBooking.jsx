import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Search, X, ChevronDown } from "lucide-react";
import ToastComponent, { showToast } from "./ui/ToastComponent";
import AnimateOnScroll from "./ui/AnimateOnScroll";

const API_URL = "http://localhost:3000/api/hotels/approved-hotels";

const BookingsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [filters, setFilters] = useState({ location: "" });
  const [loading, setLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  // Ref for scrolling to hotels section
  const hotelsContainerRef = React.useRef(null);

  useEffect(() => {
    fetchHotels();

    // Set up scroll listener for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();
      setHotels(data.data || []);
      setFilteredHotels(data.data || []);
      showToast.success("Hotels loaded successfully!");
    } catch (error) {
      showToast.error("Error fetching hotels. Please try again later.");
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
      showToast.info("No hotels match your filters.");
    } else {
      showToast.success(
        `Found ${filtered.length} hotels matching your criteria.`
      );
    }
  };

  const resetFilters = () => {
    setFilters({ location: "" });
    setFilteredHotels(hotels);
    showToast.info("Filters have been reset.");
  };

  const viewHotelData = (hotelId) => {
    navigate(`/hotel-detail/${hotelId}`);
  };

  const scrollToHotels = () => {
    hotelsContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Parallax Effect */}
      <div
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div
          className="text-center z-10 px-4 transition-all duration-700"
          style={{
            opacity: scrollY < 300 ? 1 : 0,
            transform: `translateY(${scrollY < 300 ? 0 : "2rem"})`,
          }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="mt-6 text-xl text-white max-w-2xl mx-auto mb-12">
            Discover handpicked hotels that combine comfort, luxury, and
            unforgettable experiences for your next adventure.
          </p>
          <button
            onClick={scrollToHotels}
            className="px-8 py-4 bg-[#E3A726] text-white font-semibold rounded-xl hover:bg-[#D29C1F] transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center mx-auto"
          >
            Explore Hotels <ChevronDown className="ml-2" size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-10">
        {/* Search Section */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-95">
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
                <button
                  onClick={resetFilters}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-center mt-6 space-x-4">
              <button
                className="px-8 py-3 bg-[#E3A726] text-white font-semibold rounded-xl hover:bg-[#D29C1F] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={applyFilters}
              >
                Search Hotels
              </button>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Hotels Grid Section */}
        <div ref={hotelsContainerRef}>
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Discover Amazing Places
            </h2>
          </AnimateOnScroll>

          {loading ? (
            <div className="flex justify-center items-center p-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E3A726] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, index) => (
                  <AnimateOnScroll
                    key={hotel._id}
                    animation="fade-up"
                    delay={index * 100}
                  >
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            hotel.images?.[0] ??
                            "https://via.placeholder.com/300"
                          }
                          alt={hotel.hotelName}
                          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center shadow-lg">
                          <Star
                            size={16}
                            className="text-yellow-500"
                            fill="#F59E0B"
                          />
                          <span className="ml-1 font-bold text-gray-800">
                            {hotel.rating || "4.5"}
                          </span>
                        </div>
                      </div>

                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#E3A726] transition-colors duration-300">
                          {hotel.hotelName}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {hotel.description?.slice(0, 100)}...
                        </p>

                        <div className="flex items-center mb-4 text-gray-600">
                          <MapPin size={18} className="mr-2 text-[#E3A726]" />
                          <span>{hotel.address}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {hotel.amenities
                            ?.slice(0, 3)
                            .map((amenity, index) => (
                              <span
                                key={index}
                                className="px-4 py-1.5 bg-yellow-50 text-[#E3A726] text-sm font-medium rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          {hotel.amenities?.length > 3 && (
                            <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
                              +{hotel.amenities.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-[#E3A726]">
                            <span className="text-2xl font-bold">
                              Rs.{" "}
                              {Object.values(hotel.prices || {})[0] || "200"}
                            </span>
                            <span className="text-gray-600 text-sm">
                              /night
                            </span>
                          </div>
                          <button
                            onClick={() => viewHotelData(hotel._id)}
                            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-[#E3A726] transition-colors duration-300"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))
              ) : (
                <div className="col-span-full">
                  <AnimateOnScroll animation="fade-up">
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                      <p className="text-xl text-gray-600 mb-6">
                        No hotels match your search criteria.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="px-8 py-3 bg-[#E3A726] text-white font-semibold rounded-xl hover:bg-[#D29C1F] transition-all duration-300"
                      >
                        Reset Search
                      </button>
                    </div>
                  </AnimateOnScroll>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: none !important;
        }
      `}</style>
    </div>
  );
};

export default BookingsPage;
