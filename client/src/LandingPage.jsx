import React, { useState, useEffect } from "react";
import { Hotel, Calendar, Sliders } from "lucide-react"; // Importing Lucide React icons
import "./styles.css";


import image from "./assets/mountains.jpg";
import BookingPage from "./BookingPage";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [dynamicText, setDynamicText] = useState("relax");
  const [fadeIn, setFadeIn] = useState(true);

  // Dynamic text options
  const textOptions = ["explore", "adventure", "relax", "discover"];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        index = (index + 1) % textOptions.length;
        setDynamicText(textOptions[index]);
        setFadeIn(true);
      }, 500); // Duration of fade-out
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <div className="min-h-screen bg-image-login bg-cover bg-center relative">
        {/* Overlay for Better Visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="relative z-10">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10">
            <div className="max-w-lg text-center md:text-left text-white">
              <h1 className="text-[#FFD700] text-sm font-bold uppercase mb-2">
                Best destination in Nepal and abroad
              </h1>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Travel, enjoy <br />
                and live a new <br />
                <span className="relative">
                  <span
                    className={`text-[#FFDF00] transition-opacity duration-500 ${
                      fadeIn ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {dynamicText} life
                  </span>
                </span>
              </h2>
              <p className="mt-4 text-gray-200">
                GHUMNA JAM provides the best experience for travelers to travel
                in Nepal and abroad in different countries across.
              </p>
              <button className="mt-6 px-6 py-3 bg-[#FFDF00] text-black text-lg font-medium rounded-lg hover:bg-[#FFD700] transition duration-300">
                Find out more
              </button>
            </div>
            <div className="mt-10 md:mt-0">
              <img
                src={image}
                alt="Mountains"
                className="rounded-2xl shadow-2xl w-full max-w-2xl mx-auto md:mx-0"
              />
            </div>
          </header>

          {/* Services Section */}
          <section className="py-16">
            <div className="text-center mb-12 text-white">
              <h3 className="uppercase text-sm tracking-widest text-gray-300">
                Category
              </h3>
              <h2 className="text-3xl md:text-4xl font-extrabold">
                We Offer Best Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
              {/* Service 1 - Best Hotels */}
              <Link to="/hotel-bookings" className="no-underline">
                <div className="flex flex-col items-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <div className="bg-white p-4 rounded-full shadow-md transition-transform duration-300 hover:scale-110">
                    <Hotel className="h-10 w-10 text-[#FFD700]" />
                  </div>
                  <h3 className="text-lg font-bold mt-6 text-gray-800">
                    Best Hotels
                  </h3>
                  <p className="text-gray-600 text-center mt-4">
                    Find the perfect place to stay, whether you're looking for
                    luxury resorts, budget-friendly accommodations, or cozy
                    boutique hotels.
                  </p>
                </div>
              </Link>
              {/* Service 2 */}
              <Link to="/local-events" className="no-underline">
                <div className="flex flex-col items-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="bg-white p-4 rounded-full shadow-md transition-transform duration-300 hover:scale-110">
                    <Calendar className="h-10 w-10 text-[#FFD700]" />
                  </div>
                  <h3 className="text-lg font-bold mt-6 text-gray-800">
                    Local Events
                  </h3>
                  <p className="text-gray-600 text-center mt-4">
                    Wide range of upcoming events, cultural festivals, and
                    exciting activities happening in Nepal if you're a traveler
                    and looking to explore Nepal
                  </p>
                </div>
              </Link>

              {/* Service 3 */}
              <div className="flex flex-col items-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div className="bg-white p-4 rounded-full shadow-md transition-transform duration-300 hover:scale-110">
                  <Sliders className="h-10 w-10 text-[#FFD700]" />
                </div>
                <h3 className="text-lg font-bold mt-6 text-gray-800">
                  Customization
                </h3>
                <p className="text-gray-600 text-center mt-4">
                  Are you looking for customized options in flight booking,
                  event planning, or perhaps something else? Let me know.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <BookingPage />

      {/* Testimonials Section */}
      <section className="py-16 bg-[#f1f1f1]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            What Our Customers Say
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 container mx-auto">
          {[
            {
              name: "Kshitij Adhikari",
              role: "Business Traveler",
              text: "The best hotel booking experience I've ever had. The platform is intuitive and the customer service is exceptional.",
              rating: 5,
            },
            {
              name: "Safal Sharma",
              role: "Family Vacation",
              text: "Found amazing deals for our family vacation. The filtering options made it easy to find family-friendly accommodations.",
              rating: 5,
            },
            {
              name: "Kshitij Adhikari",
              role: "Solo Traveler",
              text: "As a frequent solo traveler, I appreciate the detailed information and verified reviews. Makes me feel secure in my bookings.",
              rating: 5,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden w-80 transition-transform transform hover:scale-105"
            >
              <div className="slide slide1 bg-[#FFD700] h-20 flex items-center justify-center">
                <span className="text-5xl text-white font-bold">“</span>
              </div>
              <div className="slide slide2 bg-white p-6">
                <p className="text-gray-700 italic mb-4 text-center">
                  {item.text}
                </p>
                <h3 className="text-lg font-bold text-center text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-center text-gray-500 mb-2">
                  {item.role}
                </p>
                <div className="flex justify-center text-[#FFD700] text-lg">
                  {"★".repeat(item.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};


export default LandingPage;
