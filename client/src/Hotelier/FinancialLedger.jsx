import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Card,
  Typography,
  Spin,
  Layout,
  DatePicker,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import HotelSidebar from "./HotelSidebar";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;
const { Content } = Layout;
const { RangePicker } = DatePicker;

const FinancialLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userData } = useContext(AppContent);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        if (userData?.ownedHotel) {
          const response = await axios.get(
            `http://localhost:3000/api/booking/hotel/${userData.ownedHotel}`
          );
          setLedgerData(response.data);
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error("Error fetching ledger data:", error);
        message.error("Failed to load ledger data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerData();
  }, [userData?.ownedHotel]);

  // Date range filter logic
  useEffect(() => {
    if (dateRange) {
      const [start, end] = dateRange;
      const filtered = ledgerData.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        return (
          bookingDate >= start.startOf("day").toDate() &&
          bookingDate <= end.endOf("day").toDate()
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(ledgerData);
    }
  }, [dateRange, ledgerData]);

  const totalAmount = filteredData.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );

  const downloadExcel = () => {
    const dataToExport = filteredData.map((booking) => ({
      Date: new Date(booking.createdAt).toLocaleDateString(),
      Guest: booking.user?.name || "N/A",
      Rooms: booking.rooms?.map((r) => r.type).join(", "),
      Amount: booking.totalPrice,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger");

    const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "financial_ledger.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Guest Name",
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
      title: "Amount (Rs.)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => price.toLocaleString(),
      align: "right",
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
            <Title level={2}>Financial Ledger</Title>
            <Card>
              {loading ? (
                <Spin size="large" />
              ) : (
                <>
                  <Row justify="space-between" style={{ marginBottom: 16 }}>
                    <Col>
                      <RangePicker onChange={(range) => setDateRange(range)} />
                    </Col>
                    <Col>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={downloadExcel}
                      >
                        Download Excel
                      </Button>
                    </Col>
                  </Row>

                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    scroll={{ x: true }}
                    pagination={false}
                    summary={() => (
                      <Table.Summary.Row style={{ background: "#fafafa" }}>
                        <Table.Summary.Cell index={0} colSpan={3}>
                          <Text strong>Total</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <Text strong>{totalAmount.toLocaleString()}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                  />

                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <Text strong>
                      Total Revenue: Rs. {totalAmount.toLocaleString()}
                    </Text>
                  </div>
                </>
              )}
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FinancialLedger;
