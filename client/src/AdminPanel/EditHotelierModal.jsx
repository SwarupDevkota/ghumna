import { X } from "lucide-react";
import { useState } from "react";

const EditHotelierModal = ({
  editHotelier,
  setEditHotelier,
  updateHotelier,
}) => {
  if (!editHotelier) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-2xl py-4 px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white drop-shadow-md">
            Edit Hotelier: {editHotelier.hotelName}
          </h2>
          <button
            className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
            onClick={() => setEditHotelier(null)}
            aria-label="Close modal"
          >
            <X size={28} />
          </button>
        </div>
        <form onSubmit={updateHotelier} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotel Name
              </label>
              <input
                type="text"
                value={editHotelier.hotelName}
                onChange={(e) =>
                  setEditHotelier({
                    ...editHotelier,
                    hotelName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                value={editHotelier.ownerName}
                onChange={(e) =>
                  setEditHotelier({
                    ...editHotelier,
                    ownerName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editHotelier.email}
                onChange={(e) =>
                  setEditHotelier({
                    ...editHotelier,
                    email: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={editHotelier.phone}
                onChange={(e) =>
                  setEditHotelier({
                    ...editHotelier,
                    phone: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={editHotelier.address}
                onChange={(e) =>
                  setEditHotelier({
                    ...editHotelier,
                    address: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editHotelier.description}
                onChange={(e) =>
                  setEditHotelier({
                    ...editHotelier,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                value={editHotelier.website}
                onChange={(e) =>
                  setEditHotelier({
                    ...editHotelier,
                    website: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Types
              </label>
              <select
                multiple
                value={editHotelier.roomTypes || []}
                onChange={(e) => {
                  const options = [...e.target.options];
                  const selected = options
                    .filter((option) => option.selected)
                    .map((option) => option.value);
                  setEditHotelier({
                    ...editHotelier,
                    roomTypes: selected,
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>

          {/* Room Prices */}
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Room Prices</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {editHotelier.roomTypes?.includes("single") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Single Room Price
                  </label>
                  <input
                    type="number"
                    value={editHotelier.prices?.single || ""}
                    onChange={(e) =>
                      setEditHotelier({
                        ...editHotelier,
                        prices: {
                          ...editHotelier.prices,
                          single: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
              {editHotelier.roomTypes?.includes("double") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Double Room Price
                  </label>
                  <input
                    type="number"
                    value={editHotelier.prices?.double || ""}
                    onChange={(e) =>
                      setEditHotelier({
                        ...editHotelier,
                        prices: {
                          ...editHotelier.prices,
                          double: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
              {editHotelier.roomTypes?.includes("suite") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suite Room Price
                  </label>
                  <input
                    type="number"
                    value={editHotelier.prices?.suite || ""}
                    onChange={(e) =>
                      setEditHotelier({
                        ...editHotelier,
                        prices: {
                          ...editHotelier.prices,
                          suite: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "wifi",
                "swimmingPool",
                "pickup",
                "restaurantBar",
                "gym",
                "parking",
              ].map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={editHotelier.amenities?.includes(amenity) || false}
                    onChange={(e) => {
                      const amenities = editHotelier.amenities || [];
                      if (e.target.checked) {
                        setEditHotelier({
                          ...editHotelier,
                          amenities: [...amenities, amenity],
                        });
                      } else {
                        setEditHotelier({
                          ...editHotelier,
                          amenities: amenities.filter((a) => a !== amenity),
                        });
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`amenity-${amenity}`}
                    className="ml-2 block text-sm text-gray-700 capitalize"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Options */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Options
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["cash", "khalti", "phonePay"].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`payment-${option}`}
                    checked={
                      editHotelier.paymentOptions?.includes(option) || false
                    }
                    onChange={(e) => {
                      const paymentOptions = editHotelier.paymentOptions || [];
                      if (e.target.checked) {
                        setEditHotelier({
                          ...editHotelier,
                          paymentOptions: [...paymentOptions, option],
                        });
                      } else {
                        setEditHotelier({
                          ...editHotelier,
                          paymentOptions: paymentOptions.filter(
                            (p) => p !== option
                          ),
                        });
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`payment-${option}`}
                    className="ml-2 block text-sm text-gray-700 capitalize"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 shadow-md transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditHotelier(null)}
              className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 shadow-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotelierModal;
