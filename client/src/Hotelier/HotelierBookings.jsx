import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Tag,
  Modal,
  Card,
  Descriptions,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Layout,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import HotelSidebar from "./HotelSidebar";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const HotelierBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userData } = useContext(AppContent);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (userData?.ownedHotel) {
          const response = await axios.get(
            `http://localhost:3000/api/booking/hotel/${userData.ownedHotel}`
          );
          setBookings(response.data);
        }
      } catch (error) {
        message.error("Failed to fetch bookings");
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userData?.ownedHotel]);

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text copyable>{id.substring(0, 8)}...</Text>,
    },
    {
      title: "Guest",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.name || "N/A",
    },
    {
      title: "Room Type",
      dataIndex: "rooms",
      key: "rooms",
      render: (rooms) => rooms?.map((room) => room.type).join(", ") || "N/A",
    },
    {
      title: "Check-In",
      dataIndex: "checkInDate",
      key: "checkInDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Check-Out",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Guests",
      dataIndex: "numberOfGuests",
      key: "numberOfGuests",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) => (
        <Tag color={paymentStatus === "Paid" ? "green" : "red"}>
          {paymentStatus}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => showBookingDetails(record)}
        />
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HotelSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <Layout
        className="site-layout"
        style={{
          marginLeft: isSidebarOpen ? 256 : 64,
          transition: "margin 0.3s",
        }}
      >
        <Header style={{ padding: 0, background: "#fff" }} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="hotelier-bookings"
            style={{ padding: 24, background: "#fff" }}
          >
            <Title level={2}>Hotel Bookings Management</Title>
            <Card>
              {loading ? (
                <Spin size="large" />
              ) : (
                <Table
                  columns={columns}
                  dataSource={bookings}
                  rowKey="_id"
                  scroll={{ x: true }}
                />
              )}
            </Card>

            <Modal
              title="Booking Details"
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={[
                <Button key="back" onClick={() => setIsModalVisible(false)}>
                  Close
                </Button>,
              ]}
              width={800}
            >
              {selectedBooking && (
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Booking ID">
                    {selectedBooking._id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Guest Name">
                    {selectedBooking.user?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Guest Email">
                    {selectedBooking.user?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Room Type">
                    {selectedBooking.rooms?.map((room) => (
                      <div key={room._id}>
                        <p>
                          <strong>Type:</strong> {room.type}
                        </p>
                        <p>
                          <strong>Price:</strong> ${room.price}
                        </p>
                        <p>
                          <strong>Max Guests:</strong> {room.maxGuests}
                        </p>
                        <p>
                          <strong>Description:</strong> {room.description}
                        </p>
                      </div>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Check-In Date">
                    {new Date(selectedBooking.checkInDate).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Check-Out Date">
                    {new Date(
                      selectedBooking.checkOutDate
                    ).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Guests">
                    {selectedBooking.numberOfGuests}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Price">
                    ${selectedBooking.totalPrice}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag
                      color={
                        selectedBooking.status === "Confirmed"
                          ? "green"
                          : "orange"
                      }
                    >
                      {selectedBooking.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Status">
                    <Tag
                      color={
                        selectedBooking.paymentStatus === "Paid"
                          ? "green"
                          : "red"
                      }
                    >
                      {selectedBooking.paymentStatus}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Special Requests">
                    {selectedBooking.specialRequests || "None"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Booking Date">
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HotelierBookings;
