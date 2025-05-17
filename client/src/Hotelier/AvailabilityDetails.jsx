import React, { useContext, useState, useEffect } from "react";
import {
  Table,
  Tag,
  Modal,
  Button,
  Space,
  Descriptions,
  message,
  Spin,
  Avatar,
  Layout,
  Typography,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import HotelSidebar from "./HotelSidebar";

const { Content } = Layout;
const { Title } = Typography;

const AvailabilityDetails = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userData } = useContext(AppContent);

  useEffect(() => {
    if (userData?.ownedHotel) {
      fetchAvailabilityRequests();
    }
  }, [userData?.ownedHotel]);

  const fetchAvailabilityRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/rooms/availability/${userData.ownedHotel}`
      );
      console.log("Fetched availability requests:", response.data);
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      message.error("Failed to fetch availability requests");
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/rooms/availability/${id}/approve`
      );
      console.log("✅ Approved request:", response.data);
      message.success("Request approved");
      fetchAvailabilityRequests();
    } catch (error) {
      message.error("Failed to approve request");
      console.error("❌ Approve error:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/rooms/availability/${id}/reject`
      );
      console.log("❌ Rejected request:", response.data);
      message.success("Request rejected");
      fetchAvailabilityRequests();
    } catch (error) {
      message.error("Failed to reject request");
      console.error("❌ Reject error:", error);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.user?.image}
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <div>{record.user?.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.user?.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div>
          <div>{new Date(record.checkInDate).toLocaleDateString()}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            to {new Date(record.checkOutDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      title: "Guests/Rooms",
      key: "capacity",
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.guests} Guests</Tag>
          <Tag color="green">{record.roomsNeeded} Rooms</Tag>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Approved"
              ? "success"
              : status === "Rejected"
              ? "error"
              : "warning"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            type="text"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record._id)}
            disabled={record.status !== "Pending"}
          />
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(record._id)}
            disabled={record.status !== "Pending"}
          />
        </Space>
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
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div style={{ padding: 24, background: "#fff" }}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Availability Requests
            </Title>

            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={requests}
                rowKey="_id"
                bordered
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: userData?.ownedHotel
                    ? "No availability requests found"
                    : "No hotel assigned to your account",
                }}
              />
            </Spin>

            <Modal
              title="Request Details"
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={[
                <Button key="close" onClick={() => setIsModalVisible(false)}>
                  Close
                </Button>,
              ]}
              width={700}
            >
              {selectedRequest && (
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="User Name">
                    {selectedRequest.user?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="User Email">
                    {selectedRequest.user?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {selectedRequest.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag
                      color={
                        selectedRequest.status === "Approved"
                          ? "success"
                          : selectedRequest.status === "Rejected"
                          ? "error"
                          : "warning"
                      }
                    >
                      {selectedRequest.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Check-In Date">
                    {new Date(selectedRequest.checkInDate).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Check-Out Date">
                    {new Date(selectedRequest.checkOutDate).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Guests">
                    {selectedRequest.guests}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rooms Needed">
                    {selectedRequest.roomsNeeded}
                  </Descriptions.Item>
                  <Descriptions.Item label="Special Criteria" span={2}>
                    {selectedRequest.criteria || "None"}
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

export default AvailabilityDetails;
