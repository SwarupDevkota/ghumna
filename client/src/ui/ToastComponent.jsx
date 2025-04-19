import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Check, AlertTriangle, Info, Bell } from "lucide-react";

// Close Button
const CloseButton = ({ closeToast }) => (
  <button
    onClick={closeToast}
    className="rounded-full p-2 hover:bg-gray-200 hover:rotate-90 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
    aria-label="Close notification"
  >
    <X size={16} className="text-gray-500" />
  </button>
);

// Toast Icon
const ToastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return <Check className="text-green-500" size={20} />;
    case "error":
      return <X className="text-red-500" size={20} />;
    case "warning":
      return <AlertTriangle className="text-amber-500" size={20} />;
    case "info":
      return <Info className="text-blue-500" size={20} />;
    default:
      return <Bell className="text-purple-500" size={20} />;
  }
};

// ✅ Custom Toast Layout (with close button support)
const createCustomToast = (message, type, closeToast) => {
  return (
    <div className="flex items-center justify-between w-full gap-3">
      <div className="flex items-center gap-3">
        <div className="toast-icon-container">
          <ToastIcon type={type} />
        </div>
        <p className="font-medium">{message}</p>
      </div>
      <CloseButton closeToast={closeToast} />
    </div>
  );
};

// ✅ Main Toast Component
const ToastComponent = () => {
  return (
    <>
      <style>
        {`
          .Toastify__toast {
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            margin-bottom: 1rem;
            padding: 1rem;
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.4s ease;
          }
          .Toastify__toast:hover {
            transform: translateY(-2px) scale(1.02);
          }
          .Toastify__toast-body {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .Toastify__progress-bar {
            height: 4px;
          }
          .Toastify__toast--success {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            border-left: 4px solid #22c55e;
          }
          .Toastify__toast--error {
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
            border-left: 4px solid #ef4444;
          }
          .Toastify__toast--warning {
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border-left: 4px solid #f59e0b;
          }
          .Toastify__toast--info {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            border-left: 4px solid #3b82f6;
          }
          .Toastify__toast--default {
            background: linear-gradient(135deg, #faf5ff, #f3e8ff);
            border-left: 4px solid #8b5cf6;
          }
        `}
      </style>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeButton={false}
        draggable
        pauseOnHover
      />
    </>
  );
};

// ✅ Reusable Toast Functions
export const showToast = {
  success: (message) =>
    toast.success(({ closeToast }) =>
      createCustomToast(message, "success", closeToast)
    ),
  error: (message) =>
    toast.error(({ closeToast }) =>
      createCustomToast(message, "error", closeToast)
    ),
  warning: (message) =>
    toast.warning(({ closeToast }) =>
      createCustomToast(message, "warning", closeToast)
    ),
  info: (message) =>
    toast.info(({ closeToast }) =>
      createCustomToast(message, "info", closeToast)
    ),
  custom: (message, options = {}) =>
    toast(
      ({ closeToast }) =>
        createCustomToast(message, options.type || "default", closeToast),
      options
    ),
};

export default ToastComponent;
