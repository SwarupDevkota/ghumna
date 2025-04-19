import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Home, Package, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const roomBookings = [
    { name: "Radisson Hotel New York", rent: "USD 480.00", status: "Paid" },
    { name: "Cambria Hotel New York", rent: "USD 640.00", status: "Paid" },
    { name: "Four Points by Sheraton", rent: "USD 70.00", status: "Paid" },
  ];

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
              <h3 className="text-lg font-semibold">Rooms</h3>
              <p className="text-2xl">11</p>
            </div>
            <Home size={32} />
          </div>
          <div className="bg-green-500 text-white p-4 rounded-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Packages</h3>
              <p className="text-2xl">9</p>
            </div>
            <Package size={32} />
          </div>
          <div className="bg-red-500 text-white p-4 rounded-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Paid Package Bookings</h3>
              <p className="text-2xl">2</p>
            </div>
            <CheckCircle size={32} />
          </div>
        </div>

        {/* Room Bookings Table */}
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
