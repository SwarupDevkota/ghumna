import React, { useState } from "react";
import { Users, Hotel, Wallet, TrendingUp } from "lucide-react";
import HotelSidebar from "./HotelSidebar";

const HotelierDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const bookings = [
    { guest: "John Doe", room: "101", checkIn: "2024-03-15", nights: 3 },
    { guest: "Jane Smith", room: "204", checkIn: "2024-03-16", nights: 2 },
    { guest: "Mike Johnson", room: "305", checkIn: "2024-03-17", nights: 1 },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <HotelSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Hotel className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Rooms</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Guests</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Occupancy Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{booking.guest}</p>
                    <p className="text-sm text-gray-500">Room {booking.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{booking.checkIn}</p>
                    <p className="text-sm text-gray-500">
                      {booking.nights} nights
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Room Status Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[90px]">
                  Available (25)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[90px]">
                  Occupied (12)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-600 h-2.5 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[90px]">
                  Reserved (5)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelierDashboard;
