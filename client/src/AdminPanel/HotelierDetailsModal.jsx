import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  Home,
  Coffee,
  MapIcon,
  Image,
  FileCheck,
  Check,
  X as XIcon,
} from "lucide-react";

const HotelierDetailsModal = ({
  selectedHotelier,
  onClose,
  onApprove,
  onDecline,
}) => {
  if (!selectedHotelier) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-indigo-600 p-6">
          <button
            className="absolute right-4 top-4 text-white hover:bg-indigo-700 p-1 rounded-full transition-all"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {selectedHotelier.hotelName}
          </h2>
          <p className="text-indigo-100 mt-1 flex items-center">
            <MapPin size={16} className="mr-1" />
            {selectedHotelier.address}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Primary Details */}
          <div className="space-y-4">
            <div className="flex items-center">
              <User size={18} className="text-indigo-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Owner Name</p>
                <p className="font-medium">{selectedHotelier.ownerName}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail size={18} className="text-indigo-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedHotelier.email}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone size={18} className="text-indigo-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedHotelier.phone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Globe size={18} className="text-indigo-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a
                  href={selectedHotelier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  {selectedHotelier.website}
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <div className="flex items-start">
              <FileText size={18} className="text-indigo-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700 mt-1">
                  {selectedHotelier.description}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Home size={18} className="text-indigo-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Room Types</p>
                <p className="text-gray-700 mt-1">
                  {selectedHotelier.roomTypes?.join(", ") || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Coffee size={18} className="text-indigo-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Amenities</p>
                <p className="text-gray-700 mt-1">
                  {selectedHotelier.amenities?.join(", ") || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start md:col-span-2">
              <MapIcon size={18} className="text-indigo-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Nearby Attractions</p>
                <p className="text-gray-700 mt-1">
                  {selectedHotelier.nearbyAttractions?.join(", ") || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Images */}
          {selectedHotelier.images?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Image size={18} className="text-indigo-500 mr-2" />
                Hotel Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedHotelier.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Hotel view ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {selectedHotelier.additionalDocuments?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <FileText size={18} className="text-indigo-500 mr-2" />
                Additional Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedHotelier.additionalDocuments.map((doc, idx) => (
                  <img
                    key={idx}
                    src={doc}
                    alt={`Document ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Registration Document */}
          {selectedHotelier.registrationDocument && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <FileCheck size={18} className="text-indigo-500 mr-2" />
                Registration Document
              </h3>
              <img
                src={selectedHotelier.registrationDocument}
                alt="Registration Document"
                className="w-full max-h-64 object-contain rounded-lg shadow-sm border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="flex justify-end gap-3">
            <button
              className="flex items-center px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              onClick={onClose}
            >
              Close
            </button>
            {onDecline && (
              <button
                className="flex items-center px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
                onClick={() =>
                  onDecline(selectedHotelier._id, selectedHotelier.email)
                }
              >
                <XIcon size={18} className="mr-1" />
                Decline
              </button>
            )}
            {onApprove && (
              <button
                className="flex items-center px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-medium"
                onClick={() =>
                  onApprove(selectedHotelier._id, selectedHotelier.email)
                }
              >
                <Check size={18} className="mr-1" />
                Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelierDetailsModal;
