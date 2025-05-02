import React, { useContext, useState, useEffect } from "react";
import { Calendar, Hotel, Users, Tag } from "lucide-react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import {
  Modal,
  Card,
  Button,
  Divider,
  Row,
  Col,
  Image,
  Empty,
  Spin,
  Tag as AntTag,
} from "antd";

const AvailabilityRequests = () => {
  const { userData } = useContext(AppContent);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/rooms/availability/user/${userData?.userId}`
        );
        setApplications(response.data.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.userId) {
      fetchApplications();
    }
  }, [userData?.userId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-amber-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="Availability Requests" bordered={false} className="shadow-sm">
      {applications?.length > 0 ? (
        <div className="overflow-hidden">
          <Divider orientation="left">Your Availability Requests</Divider>
          <div className="space-y-4">
            {applications.map((booking) => (
              <Card
                key={booking._id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={4}>
                    <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center">
                      <Hotel className="h-8 w-8 text-gray-400" />
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <h4 className="text-lg font-medium truncate">
                      {booking.hotel?.name || "Unknown Hotel"}
                    </h4>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(booking.checkInDate)} -{" "}
                        {formatDate(booking.checkOutDate)}
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {booking.guests} guests
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Tag className="h-3 w-3 mr-1" />
                        {booking.roomsNeeded} rooms
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={4} className="text-right">
                    <span
                      className={`font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    <Button
                      type="default"
                      size="small"
                      className="ml-2"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Empty
          image={<Calendar className="mx-auto h-12 w-12 text-gray-300" />}
          imageStyle={{ height: 60 }}
          description={
            <span>
              <p>No bookings yet</p>
              <p className="text-sm text-gray-500">
                Start by booking a hotel room for your next trip.
              </p>
            </span>
          }
        >
          <Button type="primary" className="bg-amber-600 hover:bg-amber-700">
            Browse Hotels
          </Button>
        </Empty>
      )}

      {/* Booking Details Modal */}
      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedBooking && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Divider orientation="left">Hotel Information</Divider>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedBooking.hotel?.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedBooking.hotel?.address}
                  </p>
                </div>
              </Col>
              <Col span={12}>
                <Divider orientation="left">Booking Information</Divider>
                <div className="space-y-2">
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {formatDate(selectedBooking.checkInDate)}
                  </p>
                  <p>
                    <strong>Check-out:</strong>{" "}
                    {formatDate(selectedBooking.checkOutDate)}
                  </p>
                  <p>
                    <strong>Guests:</strong> {selectedBooking.guests}
                  </p>
                  <p>
                    <strong>Rooms Needed:</strong> {selectedBooking.roomsNeeded}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedBooking.phone}
                  </p>
                  <p>
                    <strong>Criteria:</strong>{" "}
                    {selectedBooking.criteria || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-medium ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default AvailabilityRequests;
