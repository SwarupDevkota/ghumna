import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Trash, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback data from the backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/contact");
        if (!response.ok) {
          throw new Error("Failed to fetch feedback data.");
        }
        const data = await response.json();
        console.log(data);

        setFeedbackData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

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

      toast.success("Message deleted successfully!");
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error("Failed to delete the message.");
    }
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
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Feedback Data</h1>

        {isLoading ? (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading feedback data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-600">
            <span>{error}</span>
          </div>
        ) : feedbackData.length === 0 ? (
          <div className="text-gray-600">No feedback messages found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 shadow-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Feedback Added Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbackData.map((feedback) => (
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
