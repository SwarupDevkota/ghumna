import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DollarSign, User, Mail } from "lucide-react";
import { AppContent } from "../context/AppContext";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const HotelSubmissionForm = () => {
  const { userData } = useContext(AppContent);
  const [formData, setFormData] = useState({
    hotelName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    website: "",
    roomsAvailable: {},
    roomTypes: [],
    prices: {},
    amenities: [],
    nearbyAttractions: "",
    hotelRegistrationDocument: null,
    additionalDocuments: [],
    images: [],
    paymentOptions: [],
    paymentDetails: {
      bankName: "",
      number: "",
      khaltiQrCode: null,
      phonePayQrCode: null,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  useEffect(() => {
    if (userData?.email) {
      setFormData((prevData) => ({
        ...prevData,
        email: userData.email,
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("prices.")) {
      const roomType = name.split(".")[1]; // Extract room type (e.g., "single")
      setFormData((prev) => ({
        ...prev,
        prices: { ...prev.prices, [roomType]: Number(value) || 0 },
      }));
    } else if (name.startsWith("roomsAvailable.")) {
      const roomType = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        roomsAvailable: {
          ...prev.roomsAvailable,
          [roomType]: Number(value) || 0,
        },
      }));
    } else if (name.startsWith("paymentDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        paymentDetails: { ...prev.paymentDetails, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (e.target.dataset.category === "amenities") {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, name]
          : prev.amenities.filter((amenity) => amenity !== name),
      }));
    } else if (e.target.dataset.category === "roomTypes") {
      setFormData((prev) => ({
        ...prev,
        roomTypes: checked
          ? [...prev.roomTypes, name]
          : prev.roomTypes.filter((type) => type !== name),
      }));
    } else if (e.target.dataset.category === "paymentOptions") {
      setFormData((prev) => ({
        ...prev,
        paymentOptions: checked
          ? [...prev.paymentOptions, name]
          : prev.paymentOptions.filter((option) => option !== name),
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "hotelRegistrationDocument" || name.includes("QrCode")
          ? files[0]
          : Array.from(files),
    }));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: data,
        credentials: "omit", // Explicitly omit credentials
      });
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images
      let uploadedImages = [];
      for (const image of formData.images) {
        const url = await uploadToCloudinary(image);
        if (url) uploadedImages.push(url);
      }

      // Upload hotel registration document
      let hotelRegistrationUrl = formData.hotelRegistrationDocument
        ? await uploadToCloudinary(formData.hotelRegistrationDocument)
        : null;

      // Upload additional documents
      let additionalDocsUrls = [];
      for (const doc of formData.additionalDocuments) {
        const url = await uploadToCloudinary(doc);
        if (url) additionalDocsUrls.push(url);
      }

      // Upload Khalti QR Code
      let khaltiQrCodeUrl = formData.paymentDetails.khaltiQrCode
        ? await uploadToCloudinary(formData.paymentDetails.khaltiQrCode)
        : null;

      // Upload PhonePay QR Code
      let phonePayQrCodeUrl = formData.paymentDetails.phonePayQrCode
        ? await uploadToCloudinary(formData.paymentDetails.phonePayQrCode)
        : null;

      // Prepare the data object
      const data = {
        ...formData,
        images: uploadedImages,
        hotelRegistrationDocument: hotelRegistrationUrl,
        additionalDocuments: additionalDocsUrls,
        paymentDetails: {
          ...formData.paymentDetails,
          khaltiQrCode: khaltiQrCodeUrl, // Assign the uploaded Khalti QR Code URL
          phonePayQrCode: phonePayQrCodeUrl, // Assign the uploaded PhonePay QR Code URL
        },
      };

      // Log the data being sent to the backend
      console.log("Data being sent to the backend:", data);

      // Send data to the backend
      const response = await axios.post(
        "http://localhost:3000/api/hotels/submit",
        data
      );
      console.log("Response:", response.data);
      alert("Hotel submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="flex justify-center items-center space-x-4 mb-8">
        <div
          className={`flex items-center ${
            currentStep >= 1 ? "text-indigo-600" : "text-gray-400"
          }`}
        >
          <DollarSign className="w-6 h-6" />
          <span className="ml-2">1. Hotel Details</span>
        </div>
        <div
          className={`flex items-center ${
            currentStep >= 2 ? "text-indigo-600" : "text-gray-400"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="ml-2">2. Documents & Images</span>
        </div>
        <div
          className={`flex items-center ${
            currentStep >= 3 ? "text-indigo-600" : "text-gray-400"
          }`}
        >
          <Mail className="w-6 h-6" />
          <span className="ml-2">3. Payment Info</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <div>
                <label
                  htmlFor="hotelName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hotel Name
                </label>
                <input
                  type="text"
                  id="hotelName"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Hotel Name"
                />
              </div>
              <div>
                <label
                  htmlFor="ownerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Owner's Name
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Owner's Full Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="123-456-7890"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Hotel Address"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Hotel Description"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Types
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["single", "double", "suite"].map((roomType) => (
                    <div key={roomType} className="flex items-center">
                      <input
                        type="checkbox"
                        id={roomType}
                        name={roomType}
                        data-category="roomTypes"
                        checked={formData.roomTypes.includes(roomType)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={roomType}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {roomType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and Availability for Selected Room Types */}
              {formData.roomTypes.map((roomType) => (
                <div key={roomType}>
                  <label
                    htmlFor={`${roomType}-price`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {`Price for ${
                      roomType.charAt(0).toUpperCase() + roomType.slice(1)
                    } Room ($)`}
                  </label>
                  <input
                    type="number"
                    id={`${roomType}-price`}
                    name={`prices.${roomType}`}
                    value={formData.prices[roomType] || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter price"
                    min="0"
                  />

                  <label
                    htmlFor={`${roomType}-availability`}
                    className="block text-sm font-medium text-gray-700 mt-4"
                  >
                    {`Available ${
                      roomType.charAt(0).toUpperCase() + roomType.slice(1)
                    } Rooms`}
                  </label>
                  <input
                    type="number"
                    id={`${roomType}-availability`}
                    name={`roomsAvailable.${roomType}`}
                    value={formData.roomsAvailable[roomType] || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Enter available ${roomType} rooms`}
                    min="0"
                  />
                </div>
              ))}

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "wifi",
                    "parking",
                    "swimmingPool",
                    "gym",
                    "pickup",
                    "restaurantBar",
                  ].map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={amenity}
                        name={amenity}
                        data-category="amenities"
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={amenity}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {amenity.replace(/([A-Z])/g, " $1")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Attractions */}
              <div>
                <label
                  htmlFor="nearbyAttractions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nearby Attractions
                </label>
                <textarea
                  id="nearbyAttractions"
                  name="nearbyAttractions"
                  value={formData.nearbyAttractions}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Beach, Museum, Park..."
                ></textarea>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-indigo-600 text-white p-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <label
                  htmlFor="hotelRegistrationDocument"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Hotel Registration Document
                </label>
                <input
                  type="file"
                  id="hotelRegistrationDocument"
                  name="hotelRegistrationDocument"
                  onChange={handleFileChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="additionalDocuments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Additional Documents
                </label>
                <input
                  type="file"
                  id="additionalDocuments"
                  name="additionalDocuments"
                  onChange={handleFileChange}
                  multiple
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="ownerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Owner's Name
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Owner's Full Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="owner@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="123-456-7890"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Hotel Address"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Hotel Description"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Types
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["single", "double", "suite"].map((roomType) => (
                    <div key={roomType} className="flex items-center">
                      <input
                        type="checkbox"
                        id={roomType}
                        name={roomType}
                        data-category="roomTypes"
                        checked={formData.roomTypes.includes(roomType)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={roomType}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {roomType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and Availability for Selected Room Types */}
              {formData.roomTypes.map((roomType) => (
                <div key={roomType}>
                  <label
                    htmlFor={`${roomType}-price`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {`Price for ${
                      roomType.charAt(0).toUpperCase() + roomType.slice(1)
                    } Room ($)`}
                  </label>
                  <input
                    type="number"
                    id={`${roomType}-price`}
                    name={`prices.${roomType}`}
                    value={formData.prices[roomType] || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter price"
                    min="0"
                  />

                  <label
                    htmlFor={`${roomType}-availability`}
                    className="block text-sm font-medium text-gray-700 mt-4"
                  >
                    {`Available ${
                      roomType.charAt(0).toUpperCase() + roomType.slice(1)
                    } Rooms`}
                  </label>
                  <input
                    type="number"
                    id={`${roomType}-availability`}
                    name={`roomsAvailable.${roomType}`}
                    value={formData.roomsAvailable[roomType] || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Enter available ${roomType} rooms`}
                    min="0"
                  />
                </div>
              ))}

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "wifi",
                    "parking",
                    "swimmingPool",
                    "gym",
                    "pickup",
                    "restaurantBar",
                  ].map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={amenity}
                        name={amenity}
                        data-category="amenities"
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={amenity}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {amenity.replace(/([A-Z])/g, " $1")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Attractions */}
              <div>
                <label
                  htmlFor="nearbyAttractions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nearby Attractions
                </label>
                <textarea
                  id="nearbyAttractions"
                  name="nearbyAttractions"
                  value={formData.nearbyAttractions}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Beach, Museum, Park..."
                ></textarea>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-indigo-600 text-white p-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <label
                  htmlFor="hotelRegistrationDocument"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Hotel Registration Document
                </label>
                <input
                  type="file"
                  id="hotelRegistrationDocument"
                  name="hotelRegistrationDocument"
                  onChange={handleFileChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="additionalDocuments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Additional Documents
                </label>
                <input
                  type="file"
                  id="additionalDocuments"
                  name="additionalDocuments"
                  onChange={handleFileChange}
                  multiple
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Images
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleFileChange}
                  multiple
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-gray-500 text-white p-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-indigo-600 text-white p-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              {/* Payment Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Options
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["khalti", "phonePay", "cash"].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option}
                        name={option}
                        data-category="paymentOptions"
                        checked={formData.paymentOptions.includes(option)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={option}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Render fields dynamically for selected payment options except Cash */}
              {formData.paymentOptions
                .filter((option) => option !== "cash")
                .map((option) => (
                  <div key={option} className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 capitalize">
                      {`${option} Payment Details`}
                    </h3>
                    <div className="mt-2">
                      <label
                        htmlFor={`paymentDetails.${option}BankName`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bank Name
                      </label>
                      <input
                        type="text"
                        id={`paymentDetails.${option}BankName`}
                        name={`paymentDetails.${option}BankName`}
                        value={
                          formData.paymentDetails[`${option}BankName`] || ""
                        }
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor={`paymentDetails.${option}Number`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Account/Phone Number
                      </label>
                      <input
                        type="text"
                        id={`paymentDetails.${option}Number`}
                        name={`paymentDetails.${option}Number`}
                        value={formData.paymentDetails[`${option}Number`] || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter account/phone number"
                      />
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor={`paymentDetails.${option}QrCode`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Upload QR Code
                      </label>
                      <input
                        type="file"
                        id={`paymentDetails.${option}QrCode`}
                        name={`paymentDetails.${option}QrCode`}
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        accept="image/*"
                      />
                    </div>

                    {/* Show QR Code Preview */}
                    {formData.paymentDetails[`${option}QrCode`] && (
                      <div className="mt-4">
                        <img
                          src={URL.createObjectURL(
                            formData.paymentDetails[`${option}QrCode`]
                          )}
                          alt={`${option} QR Code`}
                          className="h-24 w-24 object-cover rounded-md shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-gray-500 text-white p-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default HotelSubmissionForm;
