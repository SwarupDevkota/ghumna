import React, { useState, useEffect } from "react";
import {
  Hotel,
  Calendar,
  Sliders,
  Users,
  Map,
  Star,
  Clock,
  Shield,
} from "lucide-react";
import "./styles.css";

import image from "./assets/mountains.jpg";
import BookingPage from "./BookingPage";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [dynamicText, setDynamicText] = useState("relax");
  const [fadeIn, setFadeIn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

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
      }, 500);
    }, 3000);

    // Intersection Observer for animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".animate-on-scroll");
    sections.forEach((section) => observer.observe(section));

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const featuredDestinations = [
    {
      name: "Pokhara",
      image:
        "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg",
      description: "Scenic lake city with mountain views",
      price: "Starting from $299",
    },
    {
      name: "Kathmandu",
      image:
        "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg",
      description: "Cultural heritage and ancient temples",
      price: "Starting from $249",
    },
    {
      name: "Chitwan",
      image: "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg",
      description: "Wildlife and nature experiences",
      price: "Starting from $399",
    },
  ];

  const statistics = [
    { icon: <Users />, number: "20K+", label: "Happy Customers" },
    { icon: <Map />, number: "100+", label: "Destinations" },
    { icon: <Star />, number: "15K+", label: "Reviews" },
    { icon: <Shield />, number: "24/7", label: "Support" },
  ];

  return (
    <>
      <div className="min-h-screen bg-image-login bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="relative z-10">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10">
            <div className="max-w-lg text-center md:text-left text-white">
              <h1 className="text-amber-600 text-sm font-bold uppercase mb-2">
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
              <button className="mt-6 px-6 py-3 bg-[#FFDF00] text-black text-lg font-medium rounded-lg hover:bg-amber-600 transition duration-300">
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
              <Link to="/hotel-bookings" className="no-underline">
                <div className="flex flex-col items-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <div className="bg-white p-4 rounded-full shadow-md transition-transform duration-300 hover:scale-110">
                    <Hotel className="h-10 w-10 text-amber-600" />
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
              <Link to="/local-events" className="no-underline">
                <div className="flex flex-col items-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="bg-white p-4 rounded-full shadow-md transition-transform duration-300 hover:scale-110">
                    <Calendar className="h-10 w-10 text-amber-600" />
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
              <div className="flex flex-col items-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div className="bg-white p-4 rounded-full shadow-md transition-transform duration-300 hover:scale-110">
                  <Sliders className="h-10 w-10 text-amber-600" />
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

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-amber-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Featured Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {destination.name}
                    </h3>
                    <p className="mb-2">{destination.description}</p>
                    <p className="text-amber-600 font-semibold">
                      {destination.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingPage />

      {/* Image Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Discover Nepal's Beauty
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                url: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
                title: "Mount Everest Base Camp",
              },
              {
                url: "https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg",
                title: "Phewa Lake, Pokhara",
              },
              {
                url: "https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg",
                title: "Boudhanath Stupa",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426077/images_yvh8ou.jpg",
                title: "Annapurna Range",
              },
              {
                url: "https://images.pexels.com/photos/5458397/pexels-photo-5458397.jpeg",
                title: "Pashupatinath Temple",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426154/bhaktapur-rainy_kasqlu.jpg",
                title: "Durbar Square",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745421202/download_nau1af.jpg",
                title: "Himalayan Peaks",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426528/download_4_cdni17.jpg",
                title: "Traditional Architecture",
              },
              {
                url: "https://images.pexels.com/photos/6612157/pexels-photo-6612157.jpeg",
                title: "Mountain Village",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426700/1678688853.sidetrackimagenepal-3369877_1920_gc0eqr.jpg",
                title: "Prayer Flags",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1742706903/tnoslpmpjqybtjvlvsx3.jpg",
                title: "Lakeside Resort",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426518/Mangal-Lama-Great-Himalayan-Trail-12-1024x682_mxwc2b.jpg",
                title: "Mountain Trail",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426301/maxresdefault_klr2lu.jpg",
                title: "Ancient Temple",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426591/hq720_yrt6dr.jpg",
                title: "Sunrise at Mountains",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426300/istockphoto-476196494-612x612_sai9uy.jpg",
                title: "Local Market",
              },
              {
                url: "https://res.cloudinary.com/dl1xtwusn/image/upload/v1745426300/list-of-lakes-blog-banner_kmxrmz.webp",
                title: "Mountain Lake",
              },
            ].map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg shadow-lg ${
                  index === 0 || index === 3
                    ? "md:col-span-2 md:row-span-2"
                    : ""
                }`}
              >
                <div className="group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <p className="text-white text-center font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
                      {image.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <div className="slide slide1 bg-amber-600 h-20 flex items-center justify-center">
                <span className="text-5xl text-white font-bold">"</span>
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
                <div className="flex justify-center text-amber-600 text-lg">
                  {"★".repeat(item.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-amber-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white mb-8 max-w-2xl mx-auto">
            Stay updated with our latest travel deals, destination guides, and
            exclusive offers.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg focus:outline-none"
              />
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
