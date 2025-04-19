import {
  Home,
  MessageSquare,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  Search,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-6">
        <h1 className="text-xl font-bold">Your Company</h1>
        <nav className="space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg"
          >
            <Home size={20} /> Overview
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg"
          >
            <MessageSquare size={20} /> Messages{" "}
            <span className="ml-auto text-sm bg-red-500 rounded-full px-2">
              2
            </span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg"
          >
            <Package size={20} /> Products
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg"
          >
            <ShoppingCart size={20} /> Orders
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg"
          >
            <Users size={20} /> Customers
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg"
          >
            <Settings size={20} /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Welcome back, Matthew</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-2 top-2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 bg-white rounded-md border"
              />
            </div>
            <Bell size={24} className="text-gray-700" />
            <div className="w-10 h-10 bg-gray-400 rounded-full" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Total Sales</h3>
            <p className="text-2xl font-bold">$9,328.55</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Visitors</h3>
            <p className="text-2xl font-bold">12,302</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Refunds</h3>
            <p className="text-2xl font-bold">963</p>
          </div>
        </div>

        {/* Sales Performance (Placeholder) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Sales Performance</h3>
          <p className="text-gray-500">Graph Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
