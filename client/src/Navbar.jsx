import { useContext, useState, useRef, useEffect } from "react";
import logo from "./assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "./context/AppContext";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ToastComponent from "./ui/ToastComponent";
import axios from "axios";
import {
  User,
  LogOut,
  Home,
  Hotel,
  Calendar,
  Info,
  BookOpen,
  HelpCircle,
} from "lucide-react";

const Navbar = () => {
  const { backendUrl, userData, isLoggedin, setIsLoggedin, setUserData } =
    useContext(AppContent);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef(null);

  const handleLogout = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/auth/logout");
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData({});
        Cookies.remove("token");
        navigate("/");
        toast.success("Successfully logged out!");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  // Handle mouse events for the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    // Add event listener for clicks outside the dropdown container
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownContainerRef]);

  // Navigation items with icons
  const navItems = [
    { to: "/", label: "Home", icon: <Home size={16} /> },
    { to: "/hotel-bookings", label: "Bookings", icon: <Hotel size={16} /> },
    { to: "/local-events", label: "Events", icon: <Calendar size={16} /> },
    { to: "/aboutUs", label: "About Us", icon: <Info size={16} /> },
    { to: "/fullblogs", label: "Blogs", icon: <BookOpen size={16} /> },
    { to: "/faq", label: "FAQ", icon: <HelpCircle size={16} /> },
  ];

  return (
    <>
      <div className="font-medium text-black bg-white-200/30 flex flex-wrap justify-between items-center px-4 md:px-12 py-3 backdrop-blur-lg sticky top-0 left-0 w-full z-50 shadow-sm">
        {/* Logo */}
        <div className="rounded-full flex items-center gap-2">
          <Link to={"/"}>
            <img
              src={logo}
              className="rounded-full"
              height="60"
              width="60"
              alt="sano sansar logo"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex justify-center gap-6 md:gap-10 font-bold text-sm md:text-base">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="relative transition-all duration-300 hover:text-yellow-500 before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-1 before:bg-yellow-400 before:transition-all before:duration-300 hover:before:w-full flex items-center gap-1"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile / Login */}
        <div className="flex items-center relative">
          {isLoggedin ? (
            <div
              ref={dropdownContainerRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
            >
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 overflow-hidden">
                {userData?.image ? (
                  <img
                    src={userData.image}
                    alt={userData?.name || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User size={20} />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg overflow-hidden border">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-yellow-500 transition duration-300 font-semibold shadow-sm flex items-center gap-2">
                <User size={16} />
                <span>Log In</span>
              </button>
            </Link>
          )}
        </div>
      </div>
      <ToastComponent />
    </>
  );
};

export default Navbar;
