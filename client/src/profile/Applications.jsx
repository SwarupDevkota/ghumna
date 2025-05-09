import React, { useContext, useState, useEffect } from "react";
import { Calendar, Hotel, Users, CreditCard, CalendarDays } from "lucide-react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import {
  Modal,
  Card,
  Tag,
  Button,
  Divider,
  Row,
  Col,
  Image,
  Empty,
  Spin,
} from "antd";

const Applications = () => {
  const { userData } = useContext(AppContent);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/booking/applications/${userData?.userId}`
        );
        setApplications(response.data.applications);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="My Bookings" bordered={false} className="shadow-sm">
      {applications?.length > 0 ? (
        <div className="overflow-hidden">
          <Divider orientation="left">Your Bookings</Divider>
          <div className="space-y-4">
            {applications.map((booking) => (
              <Card
                key={booking._id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={4}>
                    {booking.hotel?.images?.[0] ? (
                      <Image
                        src={booking.hotel.images[0]}
                        alt={booking.hotel.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                        preview={false}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center">
                        <Hotel className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </Col>
                  <Col xs={24} sm={12}>
                    <h4 className="text-lg font-medium truncate">
                      {booking.hotel?.name || "Unknown Hotel"}
                    </h4>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {formatDate(booking.checkInDate)} -{" "}
                        {formatDate(booking.checkOutDate)}
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {booking.numberOfGuests} guests
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <CreditCard className="h-3 w-3 mr-1" />$
                        {booking.totalPrice}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={4} className="text-right">
                    <Button
                      type="default"
                      size="small"
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
                  <p>
                    <strong>Contact:</strong> {selectedBooking.hotel?.contact}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {selectedBooking.hotel?.description || "N/A"}
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
                    <strong>Guests:</strong> {selectedBooking.numberOfGuests}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${selectedBooking.totalPrice}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <Tag
                      color={
                        selectedBooking.paymentStatus === "Paid"
                          ? "green"
                          : "orange"
                      }
                    >
                      {selectedBooking.paymentStatus}
                    </Tag>
                  </p>
                </div>
              </Col>
            </Row>

            <Divider orientation="left">Rooms Booked</Divider>
            <Row gutter={16}>
              {selectedBooking.rooms?.map((room) => (
                <Col span={12} key={room._id} className="mb-4">
                  <Card size="small">
                    <p className="font-medium">{room.type}</p>
                    <p className="text-sm text-gray-600">
                      ${room.price} per night
                    </p>
                    <p className="text-sm text-gray-600">
                      Max guests: {room.maxGuests}
                    </p>
                    {room.description && (
                      <p className="text-sm mt-2">{room.description}</p>
                    )}
                    {room.images?.[0] && (
                      <Image
                        src={room.images[0]}
                        alt={room.type}
                        width="100%"
                        className="mt-2"
                      />
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default Applications;
