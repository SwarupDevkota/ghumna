import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BedDouble,
  CalendarCheck,
  ClipboardList,
  DollarSign,
  Menu,
  X,
  ArrowLeftIcon,
} from "lucide-react";

const HotelSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-green-600 text-white h-screen flex flex-col transition-all duration-300 fixed`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <h1
          className={`text-2xl font-bold ${isSidebarOpen ? "block" : "hidden"}`}
        >
          Hotel Admin
        </h1>
        <button
          className="text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col space-y-2 mt-4">
        <Link
          to="/hotelier-dashboard"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-green-500"
        >
          <Home size={20} />
          {isSidebarOpen && <span>Dashboard</span>}
        </Link>

        <Link
          to="/hotelier-rooms"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-green-500"
        >
          <BedDouble size={20} />
          {isSidebarOpen && <span>Rooms</span>}
        </Link>

        <Link
          to="/hotelier-bookings"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-green-500"
        >
          <ClipboardList size={20} />
          {isSidebarOpen && <span>Bookings</span>}
        </Link>

        <Link
          to="/hotelier/availability-details"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-green-500"
        >
          <CalendarCheck size={20} />
          {isSidebarOpen && <span>Reservations</span>}
        </Link>

        <Link
          to="/hotel-financials"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-green-500"
        >
          <DollarSign size={20} />
          {isSidebarOpen && <span>Financials</span>}
        </Link>

        <Link
          to="/profile"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-green-500"
        >
          <ArrowLeftIcon size={20} />
          {isSidebarOpen && <span>Back to User Profile</span>}
        </Link>
      </nav>
    </div>
  );
};

export default HotelSidebar;
