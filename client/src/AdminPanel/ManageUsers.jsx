import React, { useEffect, useState } from "react";
import {
  Loader2,
  X,
  Trash2,
  User,
  Printer,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";

const API_BASE_URL = "http://localhost:3000";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`);
      console.log("Fetched users data:", response.data);

      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        usersData = response.data.users;
      }

      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let results = users;

    // Filter by name or email
    if (searchTerm) {
      results = results.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      results = results.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= startDate && userDate <= endDate;
      });
    }

    setFilteredUsers(results);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setFilteredUsers(users);
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/user/delete-user/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error(
        "❌ Delete User API Error:",
        error.response?.data || error.message
      );
      toast.error(
        `Failed to delete user: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = document.querySelector(".print-content").outerHTML;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Manage Users</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #2563eb; margin-bottom: 10px; }
            p { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Manage Users</h1>
          <p>List of all registered users.</p>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((user) => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
        "Account Created": new Date(user.createdAt).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users.xlsx");
  };

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className={`flex-grow p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-5" : "ml-16"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Manage Users</h1>
            <p>List of all registered users.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              <Filter size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-white p-4 rounded-md shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name or Email
                </label>
                <input
                  type="text"
                  placeholder="Enter name or email..."
                  className="w-full p-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Select start date"
                    className="w-full p-2 border rounded-md"
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Select end date"
                    className="w-full p-2 border rounded-md"
                  />
                  <Calendar
                    className="absolute right-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Reset Filters
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-2 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {isLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading users...</span>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-600">
            No users found matching your criteria.
          </p>
        ) : (
          <div className="overflow-x-auto print-content">
            <table className="table-auto w-full border border-gray-300 shadow-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Account Created</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 flex items-center"
                        onClick={() => deleteUser(user._id)}
                      >
                        <Trash2 size={16} className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
