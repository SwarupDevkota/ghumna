import { useState, useEffect, useContext } from "react";
import {
  Mail,
  Phone,
  Users,
  Building,
  Bed,
  AlertCircle,
  Check,
  X,
  Clock,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContent } from "../context/AppContext";
import FeedbackModal from "../ui/FeedbackModal";
import HotelSidebar from "./HotelSidebar";

const AvailabilityDetails = () => {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(AppContent);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (!userData || !userData.email) return;

    const fetchAvailabilityDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/availability-details",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userData.email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch availability details"
          );
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        const enhancedData = (data.availabilityForm || []).map((item) => ({
          ...item,
          status: item.status || "pending",
        }));
        setAvailabilityData(enhancedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilityDetails();
  }, [userData?.email]);

  const openFeedbackModal = (id, action) => {
    setSelectedRequestId(id);
    setSelectedAction(action);
    setFeedbackMessage("");
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedRequestId || !selectedAction) {
      toast.warning("Invalid action or missing request ID.");
      return;
    }

    try {
      toast.info("Processing request...", { autoClose: 1000 });

      const endpoint = `http://localhost:3000/api/availability-details/${selectedAction}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRequestId,
          feedback: feedbackMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      toast.success(
        `Request ${
          selectedAction === "approved" ? "Approved" : "Rejected"
        } and Email Sent!`
      );

      // Update local state immediately
      setAvailabilityData((prevData) =>
        prevData.map((item) =>
          (item._id || item.id) === selectedRequestId
            ? { ...item, status: selectedAction }
            : item
        )
      );

      setIsFeedbackModalOpen(false);
    } catch (error) {
      toast.error(`Error: ${error.message || "Unknown error occurred"}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
            <Check size={12} className="mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
            <X size={12} className="mr-1" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
            <Clock size={12} className="mr-1" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <HotelSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main content */}
      <div
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <ToastContainer />

        <h1 className="text-2xl font-bold mb-6 text-center">
          Availability Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-center">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        ) : availabilityData.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center justify-center">
            <AlertCircle className="mr-2" size={20} />
            <span>No availability details found</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Special Criteria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilityData.map((form, index) => (
                  <tr
                    key={form._id || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                          <Mail className="text-blue-500 mr-2" size={16} />{" "}
                          {form.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-blue-500 mr-2" size={16} />{" "}
                          {form.phone}
                        </div>
                        {form.company && (
                          <div className="flex items-center">
                            <Building
                              className="text-blue-500 mr-2"
                              size={16}
                            />{" "}
                            {form.company}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                          <Users className="text-blue-500 mr-2" size={16} />{" "}
                          {form.guests} guests
                        </div>
                        <div className="flex items-center">
                          <Bed className="text-blue-500 mr-2" size={16} />{" "}
                          {form.roomsNeeded} rooms
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <AlertCircle className="text-blue-500 mr-2" size={16} />
                        {form.criteria || "No special criteria"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(form.status)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            openFeedbackModal(form._id || index, "approved")
                          }
                          disabled={form.status === "approved"}
                          className={`px-3 py-1 rounded-md text-xs ${
                            form.status === "approved"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          <Check size={14} className="inline mr-1" /> Accept
                        </button>
                        <button
                          onClick={() =>
                            openFeedbackModal(form._id || index, "rejected")
                          }
                          disabled={form.status === "rejected"}
                          className={`px-3 py-1 rounded-md text-xs ${
                            form.status === "rejected"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          <X size={14} className="inline mr-1" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          title={
            selectedAction === "approved" ? "Accept Request" : "Reject Request"
          }
          placeholder="Write feedback..."
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          onClose={() => setIsFeedbackModalOpen(false)}
          onSubmit={handleFeedbackSubmit}
          submitLabel={
            selectedAction === "approved" ? "Accept & Send" : "Reject & Send"
          }
          submitColor={
            selectedAction === "approved"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }
        />
      </div>
    </div>
  );
};

export default AvailabilityDetails;
