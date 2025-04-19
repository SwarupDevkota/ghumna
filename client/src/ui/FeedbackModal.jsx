// components/FeedbackModal.jsx

import React from "react";

const FeedbackModal = ({
  isOpen,
  title = "Feedback",
  placeholder = "Enter your feedback...",
  value,
  onChange,
  onClose,
  onSubmit,
  submitLabel = "Submit",
  submitColor = "bg-blue-500 hover:bg-blue-600",
  disabled = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <textarea
          rows={4}
          className="w-full border p-2 rounded mb-4"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`${submitColor} text-white px-4 py-2 rounded`}
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
