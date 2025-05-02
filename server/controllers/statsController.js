import { AvailabilityRequest } from "../models/availabilityRequest.model.js";
import Booking from "../models/booking.model.js";
import Contact from "../models/Contact.js";
import Event from "../models/Event.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/room.model.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Count all documents in parallel for better performance
    const [
      userCount,
      hotelCount,
      roomCount,
      bookingCount,
      availabilityRequestCount,
      contactCount,
      eventCount,
      pendingHotels,
      pendingEvents,
      pendingAvailabilityRequests,
      recentBookings,
      recentContacts,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments(),
      Room.countDocuments(),
      Booking.countDocuments(),
      AvailabilityRequest.countDocuments(),
      Contact.countDocuments(),
      Event.countDocuments(),
      Hotel.countDocuments({ status: "Pending" }),
      Event.countDocuments({ status: "Pending" }),
      AvailabilityRequest.countDocuments({ status: "Pending" }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .populate("hotel", "name"),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      User.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Get user counts by role
    const userCountsByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get booking status distribution
    const bookingStatusDistribution = await Booking.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get hotel status distribution
    const hotelStatusDistribution = await Hotel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the response
    const stats = {
      counts: {
        users: userCount,
        hotels: hotelCount,
        rooms: roomCount,
        bookings: bookingCount,
        availabilityRequests: availabilityRequestCount,
        contacts: contactCount,
        events: eventCount,
      },
      pendingApprovals: {
        hotels: pendingHotels,
        events: pendingEvents,
        availabilityRequests: pendingAvailabilityRequests,
      },
      distributions: {
        userRoles: userCountsByRole,
        bookingStatuses: bookingStatusDistribution,
        hotelStatuses: hotelStatusDistribution,
      },
      recentActivities: {
        bookings: recentBookings,
        contacts: recentContacts,
        users: recentUsers,
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching dashboard stats" });
  }
};

// @desc    Get chart data for admin dashboard
// @route   GET /api/admin/chart-data
// @access  Private/Admin
export const getChartData = async (req, res) => {
  try {
    // Get bookings per month for the last 12 months
    const bookingsByMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get user signups per month for the last 12 months
    const usersByMonth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get hotel registrations by month
    const hotelsByMonth = await Hotel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      bookingsByMonth,
      usersByMonth,
      hotelsByMonth,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ message: "Server error while fetching chart data" });
  }
};

export const getHotelierDashboardStats = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Verify the hotel exists and belongs to the authenticated user
    const hotel = await Hotel.findOne({
      _id: new mongoose.Types.ObjectId(hotelId),
    });

    if (!hotel) {
      return res
        .status(404)
        .json({ message: "Hotel not found or unauthorized access" });
    }

    // Count all documents in parallel for better performance
    const [
      roomCount,
      totalBookings,
      upcomingBookings,
      pendingAvailabilityRequests,
      completedBookings,
      recentBookings,
      recentAvailabilityRequests,
      revenueData,
      occupancyData,
    ] = await Promise.all([
      Room.countDocuments({ hotel: new mongoose.Types.ObjectId(hotelId) }),
      Booking.countDocuments({ hotel: new mongoose.Types.ObjectId(hotelId) }),
      Booking.countDocuments({
        hotel: new mongoose.Types.ObjectId(hotelId),
        checkInDate: { $gte: new Date() },
      }),
      AvailabilityRequest.countDocuments({
        hotel: new mongoose.Types.ObjectId(hotelId),
        status: "Pending",
      }),
      Booking.countDocuments({
        hotel: new mongoose.Types.ObjectId(hotelId),
        checkOutDate: { $lt: new Date() },
      }),
      Booking.find({ hotel: new mongoose.Types.ObjectId(hotelId) })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email"),
      AvailabilityRequest.find({ hotel: new mongoose.Types.ObjectId(hotelId) })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email"),
      // Revenue for current month
      Booking.aggregate([
        {
          $match: {
            hotel: new mongoose.Types.ObjectId(hotelId),
            paymentStatus: "Paid",
            createdAt: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]),
      // Occupancy rate calculation
      Booking.aggregate([
        {
          $match: {
            hotel: new mongoose.Types.ObjectId(hotelId),
            $or: [
              {
                checkInDate: { $lte: new Date() },
                checkOutDate: { $gte: new Date() },
              },
            ],
          },
        },
        {
          $group: {
            _id: null,
            occupiedRooms: { $sum: { $size: "$rooms" } },
          },
        },
      ]),
    ]);

    // Get total rooms count for occupancy calculation
    const totalRooms = await Room.aggregate([
      { $match: { hotel: new mongoose.Types.ObjectId(hotelId) } },
      { $group: { _id: null, total: { $sum: { $toInt: "$roomCount" } } } },
    ]);

    // Format the response
    const stats = {
      overview: {
        rooms: roomCount,
        totalBookings,
        upcomingBookings,
        pendingAvailabilityRequests,
        completedBookings,
        currentMonthRevenue: revenueData[0]?.totalRevenue || 0,
        occupancyRate: totalRooms[0]?.total
          ? Math.round(
              ((occupancyData[0]?.occupiedRooms || 0) / totalRooms[0].total) *
                100
            )
          : 0,
      },
      recentActivities: {
        bookings: recentBookings,
        availabilityRequests: recentAvailabilityRequests,
      },
      hotelInfo: {
        name: hotel.name,
        status: hotel.status,
        image: hotel.images[0] || null,
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching hotelier dashboard stats:", error);
    res.status(500).json({
      message: "Server error while fetching hotelier dashboard stats",
    });
  }
};

export const getHotelierChartData = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Verify the hotel exists and belongs to the authenticated user
    const hotel = await Hotel.findOne({
      _id: hotelId,
    });

    if (!hotel) {
      return res
        .status(404)
        .json({ message: "Hotel not found or unauthorized access" });
    }

    // Get bookings and revenue data for the last 12 months
    const bookingsByMonth = await Booking.aggregate([
      {
        $match: {
          hotel: new mongoose.Types.ObjectId(hotelId),
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get room type popularity
    const roomTypePopularity = await Booking.aggregate([
      {
        $match: {
          hotel: new mongoose.Types.ObjectId(hotelId),
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      { $unwind: "$rooms" },
      {
        $lookup: {
          from: "rooms",
          localField: "rooms",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { $unwind: "$roomDetails" },
      {
        $group: {
          _id: "$roomDetails.type",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      bookingsByMonth,
      roomTypePopularity,
    });
  } catch (error) {
    console.error("Error fetching hotelier chart data:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching hotelier chart data" });
  }
};
