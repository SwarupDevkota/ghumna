import React, { useState, useEffect } from "react";
import image from "./assets/mountains.jpg";
import swarup from "./assets/swarup.jpg";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import { ArrowUp } from "lucide-react"; // Optional: You can replace with any icon or SVG

const AboutUs = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen bg-[#FFF8E1] py-10 px-6 md:px-20 relative">
        {/* Page Header */}
        <div className="text-center mb-12 transition duration-300">
          <h3 className="uppercase text-sm tracking-wide font-bold text-[#E3A726] hover:scale-105 transition">
            About Us
          </h3>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 hover:text-[#E3A726] transition">
            Who We Are
          </h1>
          <p className="mt-4 text-gray-700 hover:opacity-80 transition">
            Discover our story, mission, and the amazing team behind our
            journey.
          </p>
        </div>

        {/* Our Story Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 hover:text-[#E3A726] transition">
                Our Journey
              </h2>
              <p className="mt-4 text-gray-600 hover:text-gray-800 transition">
                Established in 2021, we began with a passion for travel and a
                vision to connect adventurers with the world's most beautiful
                destinations...
              </p>
              <p className="mt-4 text-gray-600 hover:text-gray-800 transition">
                From humble beginnings to creating life-changing adventures, our
                journey has been nothing short of amazing.
              </p>
            </div>
            <div>
              <img
                src={image}
                alt="Our Journey"
                className="rounded-lg shadow-xl w-full hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-[#FFD700] py-12 px-6 md:px-12 rounded-lg shadow-xl mb-16 transition duration-300 hover:shadow-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            <p className="mt-4 text-gray-700">
              To inspire and empower travelers worldwide by creating meaningful
              and sustainable travel experiences.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-8 hover:text-[#E3A726] transition">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <div className="text-center hover:scale-105 transition">
              <img
                src={swarup}
                alt="Swarup Devkota"
                className="rounded-full w-32 h-32 mx-auto mb-4 hover:ring-4 hover:ring-[#E3A726] transition"
              />
              <h3 className="text-lg font-bold text-gray-800">
                Swarup Devkota
              </h3>
              <p className="text-sm text-gray-600">Developer & Designer</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactUs />

        {/* Scroll to Top Button */}
        {showButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-[#E3A726] text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
    </>
  );
};

export default AboutUs;
