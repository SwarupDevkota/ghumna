import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Hotel,
  CalendarDays,
  DollarSign,
  Users,
  Clock,
  Bed,
  AlertCircle,
  Star,
} from "lucide-react";
import { AppContent } from "../context/AppContext";
import HotelSidebar from "./HotelSidebar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const HotelierDashboard = () => {
  const { userData } = useContext(AppContent);
  const [chartData, setChartData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!userData) {
      return; // Wait until userData is available
    }

    if (!userData.ownedHotel) {
      setError("No hotel associated with this account");
      setLoading(false);
      return;
    }

    setLoading(true); // Start loading only when userData is available

    const fetchData = async () => {
      try {
        const [chartRes, dashboardRes] = await Promise.all([
          fetch(
            `http://localhost:3000/api/stats/chart-data/${userData.ownedHotel}`
          ),
          fetch(
            `http://localhost:3000/api/stats/dashboard/${userData.ownedHotel}`
          ),
        ]);

        if (!chartRes.ok || !dashboardRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const chartJson = await chartRes.json();
        const dashboardJson = await dashboardRes.json();

        setChartData(chartJson);
        setDashboardData(dashboardJson);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.ownedHotel, userData]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <HotelSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div
          className={`flex-1 flex items-center justify-center ${
            isSidebarOpen ? "ml-64" : "ml-16"
          } transition-all duration-300`}
        >
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !chartData || !dashboardData) {
    return (
      <div className="flex h-screen">
        <HotelSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div
          className={`flex-1 flex items-center justify-center ${
            isSidebarOpen ? "ml-64" : "ml-16"
          } transition-all duration-300`}
        >
          <div className="flex flex-col items-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-red-500">{error || "Failed to load data"}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthData = chartData.bookingsByMonth?.find(
      (item) => item._id === i + 1
    );
    return {
      name: new Date(currentYear, i, 1).toLocaleString("default", {
        month: "short",
      }),
      bookings: monthData?.count ?? 0,
      revenue: monthData?.revenue ?? 0,
    };
  });

  return (
    <div className="flex h-screen">
      <HotelSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div
        className={`flex-1 overflow-auto p-6 bg-gray-50 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {dashboardData.hotelInfo.name} Dashboard
            </h1>
            <div className="flex items-center mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                  dashboardData.hotelInfo.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
                aria-label={`Hotel status: ${dashboardData.hotelInfo.status}`}
              >
                {dashboardData.hotelInfo.status}
              </span>
              <div className="ml-4 flex items-center text-gray-600">
                <Star
                  className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500"
                  aria-hidden="true"
                />
                <span>{dashboardData.hotelInfo.rating?.toFixed(1) ?? 4.8}</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img
              src={dashboardData.hotelInfo.image}
              alt={`${dashboardData.hotelInfo.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Hotel className="w-6 h-6" />}
            title="Total Rooms"
            value={dashboardData.overview.rooms}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={<CalendarDays className="w-6 h-6" />}
            title="Total Bookings"
            value={dashboardData.overview.totalBookings}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Monthly Revenue"
            value={`$${dashboardData.overview.currentMonthRevenue.toLocaleString()}`}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Occupancy Rate"
            value={`${dashboardData.overview.occupancyRate}%`}
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bookings by Month */}
          <ChartCard
            title="Bookings by Month"
            icon={<CalendarDays className="w-5 h-5 text-blue-500" />}
          >
            <ResponsiveContainer width="100%" height={256}>
              <LineChart
                data={monthlyData}
                aria-label="Bookings by month chart"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Revenue by Month */}
          <ChartCard
            title="Revenue by Month"
            icon={<DollarSign className="w-5 h-5 text-green-500" />}
          >
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={monthlyData} aria-label="Revenue by month chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Room Type Popularity */}
          <ChartCard
            title="Room Type Popularity"
            icon={<Bed className="w-5 h-5 text-purple-500" />}
          >
            <ResponsiveContainer width="100%" height={256}>
              <PieChart aria-label="Room type popularity chart">
                <Pie
                  data={chartData.roomTypePopularity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.roomTypePopularity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <ActivityCard
            title="Recent Bookings"
            icon={<Clock className="w-5 h-5 text-orange-500" />}
            items={dashboardData.recentActivities.bookings.slice(0, 5)}
            renderItem={(booking) => (
              <div
                key={booking._id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {booking.user.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                    aria-label={`Booking status: ${
                      booking.status || "Pending"
                    }`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm font-medium">
                    ${booking.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {booking.numberOfGuests} guests
                  </span>
                </div>
              </div>
            )}
          />

          {/* Recent Availability Requests */}
          <ActivityCard
            title="Recent Availability Requests"
            icon={<AlertCircle className="w-5 h-5 text-red-500" />}
            items={dashboardData.recentActivities.availabilityRequests.slice(
              0,
              5
            )}
            renderItem={(request) => (
              <div
                key={request._id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {request.user.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(request.checkInDate).toLocaleDateString()} -{" "}
                      {new Date(request.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center ${
                      request.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                    aria-label={`Request status: ${request.status}`}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {request.roomsNeeded} rooms
                  </span>
                  <span className="text-sm text-gray-500">
                    {request.guests} guests
                  </span>
                </div>
                {request.criteria && (
                  <p
                    className="mt-2 text-sm text-gray-600 truncate"
                    title={request.criteria}
                  >
                    "{request.criteria}"
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`} aria-hidden="true">
        {icon}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg: lg font-semibold mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="h-64">{children}</div>
  </div>
);

const ActivityCard = ({ title, icon, items, renderItem }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((item) => renderItem(item))
      ) : (
        <p className="text-gray-500">No recent activity</p>
      )}
    </div>
  </div>
);

export default HotelierDashboard;
