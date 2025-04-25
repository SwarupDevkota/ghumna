import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Home, Package, CheckCircle } from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hotelCount, setHotelCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [isLoading, setIsLoading] = useState({
    hotels: true,
    users: true,
    events: true,
  });

  const roomBookings = [
    { name: "Radisson Hotel New York", rent: "USD 480.00", status: "Paid" },
    { name: "Cambria Hotel New York", rent: "USD 640.00", status: "Paid" },
    { name: "Four Points by Sheraton", rent: "USD 70.00", status: "Paid" },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch hotel count
        const hotelsResponse = await axios.get(
          "http://localhost:3000/api/hotels/approved-hotels"
        );
        setHotelCount(hotelsResponse.data.data.length);
        setIsLoading((prev) => ({ ...prev, hotels: false }));

        // Fetch user count
        const usersResponse = await axios.get("http://localhost:3000/api/user");
        let usersData = [];
        if (Array.isArray(usersResponse.data)) {
          usersData = usersResponse.data;
        } else if (
          usersResponse.data?.users &&
          Array.isArray(usersResponse.data.users)
        ) {
          usersData = usersResponse.data.users;
        }
        setUserCount(usersData.length);
        setIsLoading((prev) => ({ ...prev, users: false }));

        // Fetch event count
        const eventsResponse = await axios.get(
          "http://localhost:3000/api/event"
        );
        setEventCount(eventsResponse.data.length);
        setIsLoading((prev) => ({ ...prev, events: false }));
      } catch (error) {
        console.error("Error fetching counts:", error);
        setIsLoading({ hotels: false, users: false, events: false });
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500 text-white p-4 rounded-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Hotels</h3>
              {isLoading.hotels ? (
                <div className="animate-pulse h-8 w-16 bg-blue-400 rounded"></div>
              ) : (
                <p className="text-2xl">{hotelCount}</p>
              )}
            </div>
            <Home size={32} />
          </div>
          <div className="bg-green-500 text-white p-4 rounded-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Events</h3>
              {isLoading.events ? (
                <div className="animate-pulse h-8 w-16 bg-green-400 rounded"></div>
              ) : (
                <p className="text-2xl">{eventCount}</p>
              )}
            </div>
            <Package size={32} />
          </div>
          <div className="bg-red-500 text-white p-4 rounded-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Users</h3>
              {isLoading.users ? (
                <div className="animate-pulse h-8 w-16 bg-red-400 rounded"></div>
              ) : (
                <p className="text-2xl">{userCount}</p>
              )}
            </div>
            <CheckCircle size={32} />
          </div>
        </div>

        {/* Recent Room Bookings Table */}
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="text-lg font-bold mb-4">Recent Room Bookings</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Room</th>
                <th className="text-left p-2">Rent</th>
                <th className="text-left p-2">Payment Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomBookings.map((booking, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{booking.name}</td>
                  <td className="p-2">{booking.rent}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 rounded bg-green-200 text-green-800">
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button className="bg-blue-500 text-white px-4 py-1 rounded">
                      Select
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

export default AdminDashboard;
