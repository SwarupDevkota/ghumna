import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Modal,
  Card,
  Descriptions,
  Button,
  Typography,
  message,
  Spin,
  Layout,
  Breadcrumb,
  Divider,
} from "antd";
import {
  EyeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Hotel } from "lucide-react";
import axios from "axios";
import Sidebar from "./Sidebar"; // Import your Sidebar component

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/booking/all-bookings`
        );
        setBookings(response.data.allBookings || []);
      } catch (error) {
        message.error("Failed to fetch bookings");
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "green";
      case "Pending":
        return "orange";
      case "Failed":
        return "red";
      default:
        return "blue";
    }
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text copyable>{id.substring(0, 8)}...</Text>,
      width: 120,
    },
    {
      title: "Guest",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.name || "N/A",
      width: 150,
    },
    {
      title: "Room Type",
      dataIndex: "rooms",
      key: "rooms",
      render: (rooms) =>
        rooms?.map((room, index) => (
          <Tag key={index} color="blue">
            {room.type}
          </Tag>
        )) || "N/A",
      width: 150,
    },
    {
      title: "Dates",
      key: "dates",
      render: (record) => (
        <div>
          <div>
            <Text strong>Check-In:</Text>{" "}
            {record.checkInDate
              ? new Date(record.checkInDate).toLocaleDateString()
              : "N/A"}
          </div>
          <div>
            <Text strong>Check-Out:</Text>{" "}
            {record.checkOutDate
              ? new Date(record.checkOutDate).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      ),
      width: 180,
    },
    {
      title: "Guests",
      dataIndex: "numberOfGuests",
      key: "numberOfGuests",
      width: 100,
      align: "center",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <Text strong style={{ color: "#1890ff" }}>
          ${price.toLocaleString()}
        </Text>
      ),
      width: 120,
      align: "right",
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) => (
        <Tag color={getPaymentColor(paymentStatus)}>{paymentStatus}</Tag>
      ),
      width: 120,
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
      width: 80,
      align: "center",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Use your Sidebar component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <Layout
        className="site-layout"
        style={{ marginLeft: isSidebarOpen ? 250 : 80 }}
      >
        <Header
          style={{
            padding: 0,
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={
                isSidebarOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <Breadcrumb style={{ marginLeft: 16 }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>Bookings</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Header>
        <Content style={{ margin: "16px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Title level={3} style={{ marginBottom: 24 }}>
              All Bookings
            </Title>
            <Card bordered={false}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={bookings}
                  rowKey="_id"
                  scroll={{ x: true }}
                  bordered
                  size="middle"
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
                  <Descriptions.Item label="Room Details">
                    {selectedBooking.rooms?.map((room, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom:
                            index < selectedBooking.rooms.length - 1 ? 16 : 0,
                        }}
                      >
                        <Divider orientation="left" orientationMargin="0">
                          Room {index + 1}
                        </Divider>
                        <p>
                          <Text strong>Type:</Text> {room.type}
                        </p>
                        <p>
                          <Text strong>Price:</Text> ${room.price}
                        </p>
                        <p>
                          <Text strong>Max Guests:</Text> {room.maxGuests}
                        </p>
                        <p>
                          <Text strong>Description:</Text> {room.description}
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
                    <Text strong>
                      ${selectedBooking.totalPrice.toLocaleString()}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Status">
                    <Tag color={getPaymentColor(selectedBooking.paymentStatus)}>
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

export default AllBookings;
