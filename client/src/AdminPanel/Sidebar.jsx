import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Building,
  Menu,
  X,
  MessageCircle,
  FileText,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-blue-600 text-white flex flex-col transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <h1
          className={`text-2xl font-bold ${isSidebarOpen ? "block" : "hidden"}`}
        >
          GhumnaJaam Admin
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
        {/* Dashboard Link */}
        <Link
          to="/admin-dashboard"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <Home size={20} />
          {isSidebarOpen && <span>Dashboard</span>}
        </Link>

        {/* Hotel Requests Link */}
        <Link
          to="/hotel-requests"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <Building size={20} />
          {isSidebarOpen && <span>Hotel Requests</span>}
        </Link>

        {/* Verified Hoteliers List */}
        <Link
          to="/verified-hoteliers"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <CheckCircle size={20} />
          {isSidebarOpen && <span>Verified Hoteliers</span>}
        </Link>

        {/* Rejected Hoteliers List */}
        <Link
          to="/rejected-hoteliers"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <XCircle size={20} />
          {isSidebarOpen && <span>Rejected Hoteliers</span>}
        </Link>

        {/* Feedback Data Link */}
        <Link
          to="/feedback-data"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <MessageCircle size={20} />
          {isSidebarOpen && <span>Feedback Data</span>}
        </Link>

        {/* Registered Events Link */}
        <Link
          to="/registered-events"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <FileText size={20} />
          {isSidebarOpen && <span>Registered Events</span>}
        </Link>

        {/* Manage Users Link */}
        <Link
          to="/manage-users"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <Users size={20} />
          {isSidebarOpen && <span>Manage Users</span>}
        </Link>

        <Link
          to="/admin-bookings"
          className="flex items-center space-x-4 px-4 py-2 hover:bg-blue-500"
        >
          <Users size={20} />
          {isSidebarOpen && <span>All Bookings</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
// eng
