import React, { useContext, useState, useEffect } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Modal,
  Card,
  Tag,
  Space,
  Typography,
  Image,
  Spin,
  message,
  Layout,
} from "antd";
import RoomModal from "./RoomModal";
import { AppContent } from "../context/AppContext";
import HotelSidebar from "./HotelSidebar";

const { Title, Text } = Typography;
const { Content } = Layout;

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const { userData } = useContext(AppContent);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData?.ownedHotel) {
      fetchRooms();
    }
  }, [userData?.ownedHotel]);

  const openModal = (room = null) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/rooms?hotelId=${userData.ownedHotel}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      message.error("Failed to load rooms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateRoom = async (formData) => {
    try {
      const url = editingRoom
        ? `http://localhost:3000/api/rooms/update/${editingRoom._id}`
        : "http://localhost:3000/api/rooms/add";

      const method = "POST";

      const requestBody = {
        ...formData,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save room data");
      }

      const result = await response.json();

      if (editingRoom) {
        setRooms(
          rooms.map((r) => (r._id === result.room._id ? result.room : r))
        );
      } else {
        setRooms([...rooms, result.room]);
      }

      message.success(
        `Room ${editingRoom ? "updated" : "added"} successfully!`
      );
      closeModal();
    } catch (error) {
      console.error("Error saving room:", error);
      message.error(error.message || "Failed to save room. Please try again.");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this room?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/rooms/${roomId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete room");
          }

          setRooms(rooms.filter((room) => room._id !== roomId));
          message.success("Room deleted successfully");
        } catch (error) {
          console.error("Error deleting room:", error);
          message.error("Failed to delete room. Please try again.");
        }
      },
    });
  };

  const columns = [
    {
      title: "Room Count",
      dataIndex: "roomCount",
      key: "roomCount",
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <Image
          width={50}
          src={images?.[0] || "/placeholder-room.jpg"}
          alt="Room"
          fallback="/placeholder-room.jpg"
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: "Max Guests",
      dataIndex: "maxGuests",
      key: "maxGuests",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteRoom(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <HotelSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <Layout
        className="site-layout"
        style={{
          marginLeft: isSidebarOpen ? 256 : 64,
          transition: "margin 0.3s",
        }}
      >
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="room-management"
            style={{ padding: 24, background: "#fff" }}
          >
            <Space
              style={{ width: "100%", marginBottom: 24 }}
              direction="vertical"
            >
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Title level={2}>Room Management</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal()}
                >
                  Add Room
                </Button>
              </Space>
            </Space>

            <RoomModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSubmit={handleAddOrUpdateRoom}
              editingRoom={editingRoom}
            />

            <Card>
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : rooms.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Text type="secondary">
                    No rooms found. Add your first room!
                  </Text>
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={rooms}
                  rowKey="_id"
                  scroll={{ x: true }}
                />
              )}
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RoomManagement;
