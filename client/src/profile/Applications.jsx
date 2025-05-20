import React, { useContext, useState, useEffect } from "react";
import {
  Calendar,
  Hotel,
  Users,
  CreditCard,
  CalendarDays,
  MapPin,
  Phone,
  Star,
  CheckCircle,
} from "lucide-react";
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
      <div className="loading-container">
        <Spin size="large" />
        <p className="loading-text">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <Card
          title={<h1 className="page-title">My Bookings</h1>}
          bordered={false}
          className="main-card"
        >
          <p className="text-xs text-gray-500 italic mt-1">
            ⚠️ Contact Hotel for cancellations or refunds after booking
            confirmation.
          </p>
          {applications?.length > 0 ? (
            <div className="bookings-container">
              <Divider orientation="left" className="section-divider">
                Your Bookings
              </Divider>
             
              <div className="bookings-list">
                {applications.map((booking) => (
                  <Card key={booking._id} className="booking-card" hoverable>
                    <div className="booking-content">
                      <div className="booking-header">
                        <h3 className="hotel-name">
                          {booking.hotel?.name || "Unknown Hotel"}
                        </h3>
                        <span className="price">Rs. {booking.totalPrice}</span>
                      </div>
                      <p className="address">
                        {booking.hotel?.address || "No address available"}
                      </p>
                      <div className="booking-details">
                        <div className="detail-item">
                          <CalendarDays className="detail-icon" size={16} />
                          <span>
                            {formatDate(booking.checkInDate)} -{" "}
                            {formatDate(booking.checkOutDate)}
                          </span>
                        </div>
                        <div className="detail-item">
                          <Users className="detail-icon" size={16} />
                          <span>{booking.numberOfGuests} guests</span>
                        </div>
                      </div>
                      <div className="booking-footer">
                        <Tag color="green" className="status-tag">
                          Confirmed
                        </Tag>
                        <Button
                          type="text"
                          className="view-details-button"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Empty
                image={
                  <div className="empty-icon">
                    <Calendar className="calendar-icon" size={48} />
                    <Hotel className="hotel-icon" size={48} />
                  </div>
                }
                imageStyle={{ height: 80 }}
                description={
                  <div className="empty-text">
                    <h3 className="empty-title">No Bookings Yet</h3>
                    <p className="empty-description">
                      Discover your next adventure! Explore our curated
                      selection of hotels and book your perfect stay.
                    </p>
                  </div>
                }
              >
                <Button type="primary" className="browse-button">
                  <a href="/hotels">Browse Hotels</a>
                </Button>
              </Empty>
            </div>
          )}

          <Modal
            title="Booking Details"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={600}
            className="booking-modal"
            style={{ top: 20 }}
          >
            {selectedBooking && (
              <div className="modal-content">
                <div className="hotel-info-section">
                  <h3 className="hotel-name">{selectedBooking.hotel?.name}</h3>
                  <div className="hotel-contact">
                    <p className="hotel-address">
                      <MapPin size={16} className="icon" />
                      {selectedBooking.hotel?.address}
                    </p>
                    {selectedBooking.hotel?.contact && (
                      <p className="hotel-phone">
                        <Phone size={16} className="icon" />
                        {selectedBooking.hotel.contact}
                      </p>
                    )}
                  </div>
                  {selectedBooking.hotel?.description && (
                    <p className="hotel-description">
                      {selectedBooking.hotel.description}
                    </p>
                  )}
                </div>

                <Divider className="section-divider" />

                <div className="booking-summary-section">
                  <h4 className="section-title">Booking Summary</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <p className="label">Check-in</p>
                      <p className="value">
                        {formatDate(selectedBooking.checkInDate)}
                      </p>
                    </div>
                    <div className="summary-item">
                      <p className="label">Check-out</p>
                      <p className="value">
                        {formatDate(selectedBooking.checkOutDate)}
                      </p>
                    </div>
                    <div className="summary-item">
                      <p className="label">Guests</p>
                      <p className="value">
                        {selectedBooking.numberOfGuests} guests
                      </p>
                    </div>
                    <div className="summary-item">
                      <p className="label">Payment Status</p>
                      <p className="value">
                        <Tag color="#52c41a" icon={<CheckCircle size={12} />}>
                          Paid
                        </Tag>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="price-summary">
                  <p className="total-price">
                    Rs. {selectedBooking.totalPrice}{" "}
                    <span className="total-label">total</span>
                  </p>
                  <p className="nights">
                    {Math.ceil(
                      (new Date(selectedBooking.checkOutDate).getTime() -
                        new Date(selectedBooking.checkInDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    nights
                  </p>
                </div>

                <Divider className="section-divider" />

                <div className="rooms-section">
                  <h4 className="section-title">Rooms Booked</h4>
                  {selectedBooking.rooms?.map((room) => (
                    <div key={room._id} className="room-card">
                      <div className="room-header">
                        <h5 className="room-title">{room.type}</h5>
                        <p className="room-price">Rs. {room.price}/night</p>
                      </div>
                      <div className="room-details">
                        <p className="room-guest-info">
                          <Users size={16} className="icon" />
                          Max {room.maxGuests} guests
                        </p>
                        {room.description && (
                          <p className="room-description">{room.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal>
        </Card>
      </div>

      <style jsx global>{`
        /* Global Styles */
        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
          color: #333;
          line-height: 1.5;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 16px;
        }

        .loading-text {
          color: #666;
          font-size: 16px;
        }

        /* Main Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 0;
          color: #333;
        }

        /* Bookings List */
        .bookings-container {
          margin-top: 24px;
        }

        .section-divider.ant-divider {
          font-size: 16px;
          color: #666;
          border-color: #f0f0f0;
        }

        .bookings-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .booking-card.ant-card {
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .booking-card .ant-card-body {
          padding: 16px;
        }

        .booking-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hotel-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #333;
        }

        .price {
          font-size: 18px;
          font-weight: 600;
          color: #1890ff;
        }

        .address {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .booking-details {
          display: flex;
          gap: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 14px;
        }

        .detail-icon {
          color: #999;
        }

        .booking-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-tag.ant-tag {
          background: #f6ffed;
          border-color: #b7eb8f;
          color: #52c41a;
          font-size: 12px;
          padding: 0 8px;
          margin-right: auto;
        }

        .view-details-button.ant-btn {
          color: #1890ff;
          padding: 0;
          height: auto;
        }

        /* Empty State */
        .empty-state {
          padding: 40px 0;
          text-align: center;
        }

        .empty-icon {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .empty-text {
          margin-bottom: 24px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .empty-description {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .browse-button.ant-btn {
          padding: 0 24px;
          height: 40px;
        }

        /* Booking Modal */
        .booking-modal .ant-modal-content {
          border-radius: 12px;
          padding: 24px;
        }

        .booking-modal .ant-modal-header {
          border-bottom: none;
          padding-bottom: 0;
        }

        .booking-modal .ant-modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          text-align: center;
          margin-bottom: 0;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hotel-info-section {
          margin-bottom: 8px;
        }

        .hotel-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .hotel-contact {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .hotel-address,
        .hotel-phone {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .hotel-description {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .section-divider.ant-divider {
          margin: 16px 0;
        }

        .booking-summary-section {
          margin-bottom: 8px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .summary-item {
          margin-bottom: 8px;
        }

        .label {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .value {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin: 0;
        }

        .price-summary {
          text-align: center;
          margin: 16px 0;
        }

        .total-price {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .total-label {
          font-size: 16px;
          font-weight: 400;
          color: #666;
        }

        .nights {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .rooms-section {
          margin-top: 8px;
        }

        .room-card {
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .room-card:last-child {
          border-bottom: none;
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .room-title {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin: 0;
        }

        .room-price {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin: 0;
        }

        .room-guest-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .room-description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        .icon {
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default Applications;
