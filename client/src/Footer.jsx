import React from "react";
import { Facebook, Instagram, Play, Apple } from "lucide-react"; // Import Lucide icons
import logo from "./assets/logo.png"; // Replace with your logo path

const Footer = () => {
  return (
    <footer className="bg-gray-300 py-10 px-6 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Logo Section */}
        <div className="mb-8 md:mb-0">
          <img src={logo} alt="Ghumna Jam Logo" className="h-16" />
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap justify-between w-full md:w-auto gap-8">
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-gray-800">Company</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="/aboutUs"
                  className="text-gray-600 hover:text-indigo-500"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/partners"
                  className="text-gray-600 hover:text-indigo-500"
                >
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="font-bold text-gray-800">Contact</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/faq" className="text-gray-600 hover:text-indigo-500">
                  Help/FAQ
                </a>
              </li>
              <li>
                <a
                  href="/hoteliers-form"
                  className="text-gray-600 hover:text-indigo-500"
                >
                  Hoteliers Form
                </a>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="font-bold text-gray-800">More</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="/event-registration"
                  className="text-gray-600 hover:text-indigo-500"
                >
                  Event Registration
                </a>
              </li>
              <li>
                <a
                  href="/aboutUs"
                  className="text-gray-600 hover:text-indigo-500"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & App Section */}
        <div className="flex flex-col items-center mt-8 md:mt-0">
          <div className="flex gap-4 mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white transition"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-200 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 transition text-gray-800 hover:text-white"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>

          <h3 className="text-gray-800 font-bold mb-4">Discover our app</h3>
          <div className="flex gap-4">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Play className="h-5 w-5 mr-2" />
              Google Play
            </a>
            <a
              href="https://apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Apple className="h-5 w-5 mr-2" />
              Apple Store
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 text-gray-500 text-sm">
        All rights reserved Swarup
      </div>
    </footer>
  );
};

export default Footer;
