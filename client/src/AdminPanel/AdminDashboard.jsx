import React, { useEffect, useState } from "react";
import {
  Users,
  Hotel,
  Bed,
  CalendarCheck,
  Mail,
  Calendar,
  AlertCircle,
  Activity,
  Clock,
} from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./Sidebar";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch(
          "http://localhost:3000/api/stats/admin-stats"
        ).then((res) => res.json());

        const chartResponse = await fetch(
          "http://localhost:3000/api/stats/chart-data"
        ).then((res) => res.json());

        setStats(statsResponse);
        setChartData(chartResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats || !chartData) {
    return <div className="p-6 text-red-500">Error loading data</div>;
  }

  // Prepare chart data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const bookingsChartData = {
    labels: chartData.bookingsByMonth.map((item) => months[item._id - 1]),
    datasets: [
      {
        label: "Bookings",
        data: chartData.bookingsByMonth.map((item) => item.count),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Revenue (NPR)",
        data: chartData.bookingsByMonth.map((item) => item.totalRevenue),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  const growthChartData = {
    labels: months.slice(0, new Date().getMonth() + 1),
    datasets: [
      {
        label: "Users",
        data: Array(12)
          .fill(0)
          .map((_, i) => {
            const monthData = chartData.usersByMonth.find(
              (item) => item._id === i + 1
            );
            return monthData ? monthData.count : 0;
          })
          .slice(0, new Date().getMonth() + 1),
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Hotels",
        data: Array(12)
          .fill(0)
          .map((_, i) => {
            const monthData = chartData.hotelsByMonth.find(
              (item) => item._id === i + 1
            );
            return monthData ? monthData.count : 0;
          })
          .slice(0, new Date().getMonth() + 1),
        borderColor: "rgba(139, 92, 246, 1)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Content */}
        <main
          className="flex-1 overflow-y-auto p-6 transition-all duration-300"
          style={{
            marginLeft: isSidebarOpen ? "5rem" : "1rem",
            paddingBottom: "6rem", // Extra space for footer
          }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Admin Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="h-6 w-6" />}
              title="Users"
              value={stats.counts.users}
              change={0}
              color="blue"
            />
            <StatCard
              icon={<Hotel className="h-6 w-6" />}
              title="Hotels"
              value={stats.counts.hotels}
              change={0}
              color="purple"
            />
            <StatCard
              icon={<Bed className="h-6 w-6" />}
              title="Rooms"
              value={stats.counts.rooms}
              change={0}
              color="green"
            />
            <StatCard
              icon={<CalendarCheck className="h-6 w-6" />}
              title="Bookings"
              value={stats.counts.bookings}
              change={0}
              color="indigo"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Bookings & Revenue
              </h2>
              <div className="h-80">
                <Bar
                  data={bookingsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Number of Bookings" },
                      },
                      y1: {
                        beginAtZero: true,
                        position: "right",
                        title: { display: true, text: "Revenue (NPR)" },
                        grid: { drawOnChartArea: false },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-amber-500" />
                User & Hotel Growth
              </h2>
              <div className="h-80">
                <Line
                  data={growthChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              Pending Approvals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ApprovalCard
                title="Hotels"
                count={stats.pendingApprovals.hotels}
                icon={<Hotel className="h-5 w-5" />}
              />
              <ApprovalCard
                title="Events"
                count={stats.pendingApprovals.events}
                icon={<Calendar className="h-5 w-5" />}
              />
              <ApprovalCard
                title="Availability Requests"
                count={stats.pendingApprovals.availabilityRequests}
                icon={<Clock className="h-5 w-5" />}
              />
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentActivities
              title="Recent Bookings"
              icon={<CalendarCheck className="h-5 w-5" />}
              items={stats.recentActivities.bookings
                .slice(0, 5)
                .map((booking) => ({
                  id: booking._id,
                  title: `${booking.hotel.name} Booking`,
                  description: `${booking.numberOfGuests} guests • NPR ${booking.totalPrice}`,
                  date: new Date(booking.createdAt).toLocaleDateString(),
                  status: booking.status,
                }))}
            />

            <RecentActivities
              title="Recent Contacts"
              icon={<Mail className="h-5 w-5" />}
              items={stats.recentActivities.contacts
                .slice(0, 5)
                .map((contact) => ({
                  id: contact._id,
                  title: contact.name,
                  description: contact.message,
                  date: contact.createdAt,
                  email: contact.email,
                }))}
            />

            <RecentActivities
              title="Recent Users"
              icon={<Users className="h-5 w-5" />}
              items={stats.recentActivities.users.slice(0, 5).map((user) => ({
                id: user._id,
                title: user.name,
                description: user.role,
                date: new Date(user.createdAt).toLocaleDateString(),
                email: user.email,
              }))}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Hotel Management System
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

// Approval Card Component
const ApprovalCard = ({ title, count, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
      <div className="p-3 rounded-full bg-gray-100 text-gray-600 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-700">{title}</h3>
        <p className="text-2xl font-bold">{count} pending</p>
      </div>
    </div>
  );
};

// Recent Activities Component
const RecentActivities = ({ title, icon, items }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                {item.email && (
                  <p className="text-xs text-gray-400">{item.email}</p>
                )}
              </div>
              <div className="text-xs text-gray-400">{item.date}</div>
            </div>
            {item.status && (
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                  item.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
