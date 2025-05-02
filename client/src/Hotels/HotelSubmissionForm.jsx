import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Building, FileText, Image, ArrowLeft, ArrowRight } from "lucide-react";
import { AppContent } from "../context/AppContext";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

const HotelSubmissionForm = () => {
  const { userData } = useContext(AppContent);

  const [formData, setFormData] = useState({
    name: "",
    owner: userData?.userId || "",
    email: userData?.email || "",
    phone: "",
    address: "",
    description: "",
    website: "",
    amenities: [],
    nearbyAttractions: "",
    registrationDocument: null,
    additionalDocuments: [],
    images: [],
    roomTypes: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, name: "Basic Info", icon: <Building size={18} /> },
    { id: 2, name: "Documents", icon: <FileText size={18} /> },
    { id: 3, name: "Media", icon: <Image size={18} /> },
  ];

  useEffect(() => {
    if (userData?.email) {
      setFormData((prev) => ({
        ...prev,
        email: userData.email,
        owner: userData.userId,
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const category = e.target.dataset.category;

    setFormData((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], name]
        : prev[category].filter((item) => item !== name),
    }));
    // Clear error for this category
    setErrors((prev) => ({ ...prev, [category]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "registrationDocument" ? files[0] : Array.from(files),
    }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Hotel name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.description)
        newErrors.description = "Description is required";
    } else if (currentStep === 2) {
      if (!formData.registrationDocument)
        newErrors.registrationDocument = "Registration document is required";
    } else if (currentStep === 3) {
      if (formData.images.length < 3)
        newErrors.images = "At least 3 images are required";
      if (formData.roomTypes.length === 0)
        newErrors.roomTypes = "At least one room type must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error?.message || "Upload failed");
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    try {
      // Upload files
      const uploadFiles = [
        formData.registrationDocument &&
          uploadToCloudinary(formData.registrationDocument),
        ...formData.additionalDocuments.map((file) => uploadToCloudinary(file)),
        ...formData.images.map((file) => uploadToCloudinary(file)),
      ].filter(Boolean);

      const uploaded = await Promise.all(uploadFiles);
      const [regDoc, ...restFiles] = uploaded;

      const dataToSend = {
        ...formData,
        registrationDocument: regDoc?.secure_url || "",
        additionalDocuments: restFiles
          .slice(0, formData.additionalDocuments.length)
          .map((doc) => doc?.secure_url)
          .filter(Boolean),
        images: restFiles
          .slice(formData.additionalDocuments.length)
          .map((img) => img?.secure_url)
          .filter(Boolean),
        nearbyAttractions: formData.nearbyAttractions
          ? formData.nearbyAttractions.split(",").map((a) => a.trim())
          : [],
      };

      console.log("Data to send to backend:", dataToSend);

      await axios.post("http://localhost:3000/api/hotels/submit", dataToSend);
      alert("Hotel submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit hotel.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Hotel Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Hotel Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full p-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? "border-red-500" : ""
                }`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["wifi", "parking", "pool", "gym", "restaurant", "spa"].map(
                  (amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={amenity}
                        name={amenity}
                        data-category="amenities"
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label
                        htmlFor={amenity}
                        className="ml-2 text-sm capitalize"
                      >
                        {amenity}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Registration and Additional Documents */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Registration Document
              </label>
              <input
                type="file"
                name="registrationDocument"
                onChange={handleFileChange}
                className={`w-full p-2 border rounded-md ${
                  errors.registrationDocument ? "border-red-500" : ""
                }`}
                accept="image/*"
                required
              />
              {errors.registrationDocument && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.registrationDocument}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Additional Documents
              </label>
              <input
                type="file"
                name="additionalDocuments"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md"
                multiple
                accept="image/*"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nearby Attractions (comma separated)
              </label>
              <input
                type="text"
                name="nearbyAttractions"
                value={formData.nearbyAttractions}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Beach, Museum, Park"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {/* Hotel Images */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Hotel Images
              </label>
              <input
                type="file"
                name="images"
                onChange={handleFileChange}
                className={`w-full p-2 border rounded-md ${
                  errors.images ? "border-red-500" : ""
                }`}
                multiple
                accept="image/*"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload at least 3 images
              </p>
              {errors.images && (
                <p className="text-red-500 text-xs mt-1">{errors.images}</p>
              )}
            </div>

            {/* Room Types */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Room Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["single", "double", "suite", "family", "deluxe"].map(
                  (type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={type}
                        name={type}
                        data-category="roomTypes"
                        checked={formData.roomTypes.includes(type)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor={type} className="ml-2 text-sm capitalize">
                        {type}
                      </label>
                    </div>
                  )
                )}
              </div>
              {errors.roomTypes && (
                <p className="text-red-500 text-xs mt-1">{errors.roomTypes}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Register Your Hotel
          </h2>

          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm mt-2 ${
                    currentStep >= step.id
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </button>
              )}

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Hotel"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelSubmissionForm;
