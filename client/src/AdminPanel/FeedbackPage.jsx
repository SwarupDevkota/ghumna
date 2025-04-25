import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  Trash,
  Loader2,
  Printer,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";

const FeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFeedback, setFilteredFeedback] = useState([]);

  // Fetch feedback data from the backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/contact");
        if (!response.ok) {
          throw new Error("Failed to fetch feedback data.");
        }
        const data = await response.json();
        setFeedbackData(data);
        setFilteredFeedback(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Apply filters whenever search term or dates change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, endDate, feedbackData]);

  const applyFilters = () => {
    let results = feedbackData;

    // Filter by name or email
    if (searchTerm) {
      results = results.filter(
        (feedback) =>
          feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      results = results.filter((feedback) => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate >= startDate && feedbackDate <= endDate;
      });
    }

    setFilteredFeedback(results);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setFilteredFeedback(feedbackData);
  };

  // Handle deleting a feedback message
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the message.");
      }

      setFeedbackData((prevData) =>
        prevData.filter((feedback) => feedback._id !== id)
      );
      setFilteredFeedback((prevData) =>
        prevData.filter((feedback) => feedback._id !== id)
      );

      toast.success("Message deleted successfully!");
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error("Failed to delete the message.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = document.querySelector(".print-content").outerHTML;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Feedback Messages</title>
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
          <h1>Feedback Messages</h1>
          <p>List of all customer feedback messages.</p>
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
      filteredFeedback.map((feedback) => ({
        Name: feedback.name,
        Email: feedback.email,
        Message: feedback.message,
        Date: new Date(feedback.createdAt).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback Messages");
    XLSX.writeFile(workbook, "FeedbackMessages.xlsx");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-grow p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-5" : "ml-16"
        }`}
      >
        <ToastContainer />
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Feedback Data</h1>
            <p>List of all customer feedback messages.</p>
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
          Showing {filteredFeedback.length} of {feedbackData.length} messages
        </div>

        {isLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading feedback data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-600">
            <span>{error}</span>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="text-gray-600">
            No messages found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto print-content">
            <table className="table-auto w-full border border-gray-300 shadow-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((feedback) => (
                  <tr key={feedback._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{feedback.name}</td>
                    <td className="px-4 py-2">{feedback.email}</td>
                    <td className="px-4 py-2">{feedback.message}</td>
                    <td className="px-4 py-2">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(feedback._id)}
                      >
                        <Trash size={20} />
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

export default FeedbackPage;
