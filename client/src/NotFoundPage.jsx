import React from "react";
import {
  Home,
  Search,
  Calendar,
  HelpCircle,
  Map,
  PhoneCall,
  Briefcase,
  Sunset,
} from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6 text-gray-800 font-sans">
      <div className="w-full max-w-5xl">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20 hidden lg:block">
          <Sunset size={120} className="text-indigo-300" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 backdrop-blur-sm bg-white/60 rounded-3xl shadow-xl p-8 md:p-12 border border-white/50">
          <div className="text-center">
            {/* Error Code with Enhanced Typography */}
            <div className="relative inline-block mb-6">
              <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
                404
              </h1>
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-full shadow-lg animate-pulse">
                <Briefcase size={28} className="text-white" />
              </div>
            </div>

            {/* Luxurious Heading */}
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-gray-800 mb-8">
              Suite Not Found
            </h2>

            {/* Elegant Description */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              It appears the luxury accommodation you were looking for has been
              reserved elsewhere or doesn't exist in our collection.
            </p>
          </div>

          {/* Sophisticated Hotel Illustration */}
          <div className="w-full max-w-3xl mx-auto my-12 perspective-1000">
            <div className="relative transform transition-transform hover:rotate-y-10 duration-700">
              <svg viewBox="0 0 800 300" className="w-full drop-shadow-lg">
                {/* Luxury Hotel Building */}
                <rect
                  x="150"
                  y="50"
                  width="500"
                  height="200"
                  fill="#f8fafc"
                  rx="6"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <rect
                  x="100"
                  y="100"
                  width="600"
                  height="150"
                  fill="#f1f5f9"
                  rx="6"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <rect
                  x="200"
                  y="20"
                  width="400"
                  height="180"
                  fill="#f8fafc"
                  rx="6"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />

                {/* Hotel Entrance */}
                <rect
                  x="350"
                  y="150"
                  width="100"
                  height="100"
                  fill="#ede9fe"
                  rx="6"
                />
                <rect
                  x="370"
                  y="170"
                  width="60"
                  height="80"
                  fill="#c7d2fe"
                  rx="4"
                />

                {/* Windows */}
                <rect
                  x="230"
                  y="60"
                  width="40"
                  height="60"
                  fill="#dbeafe"
                  rx="2"
                  stroke="#bfdbfe"
                  strokeWidth="1"
                />
                <rect
                  x="290"
                  y="60"
                  width="40"
                  height="60"
                  fill="#dbeafe"
                  rx="2"
                  stroke="#bfdbfe"
                  strokeWidth="1"
                />
                <rect
                  x="350"
                  y="60"
                  width="40"
                  height="60"
                  fill="#dbeafe"
                  rx="2"
                  stroke="#bfdbfe"
                  strokeWidth="1"
                />
                <rect
                  x="410"
                  y="60"
                  width="40"
                  height="60"
                  fill="#dbeafe"
                  rx="2"
                  stroke="#bfdbfe"
                  strokeWidth="1"
                />
                <rect
                  x="470"
                  y="60"
                  width="40"
                  height="60"
                  fill="#dbeafe"
                  rx="2"
                  stroke="#bfdbfe"
                  strokeWidth="1"
                />
                <rect
                  x="530"
                  y="60"
                  width="40"
                  height="60"
                  fill="#dbeafe"
                  rx="2"
                  stroke="#bfdbfe"
                  strokeWidth="1"
                />

                {/* Pool */}
                <rect
                  x="600"
                  y="120"
                  width="150"
                  height="80"
                  fill="#a5f3fc"
                  rx="8"
                  stroke="#7dd3fc"
                  strokeWidth="2"
                />
                <path
                  d="M610,130 Q675,160 740,130"
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth="3"
                />
                <path
                  d="M610,150 Q675,180 740,150"
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth="2"
                />

                {/* Palm Trees */}
                <path
                  d="M600,120 C610,90 590,85 600,70"
                  fill="none"
                  stroke="#166534"
                  strokeWidth="3"
                />
                <circle cx="600" cy="63" r="15" fill="#4ade80" />

                <path
                  d="M750,120 C760,90 740,85 750,70"
                  fill="none"
                  stroke="#166534"
                  strokeWidth="3"
                />
                <circle cx="750" cy="63" r="15" fill="#4ade80" />

                {/* Decorative elements */}
                <circle cx="400" cy="250" r="10" fill="#c4b5fd" opacity="0.6" />
                <circle cx="430" cy="250" r="10" fill="#c4b5fd" opacity="0.6" />
                <circle cx="370" cy="250" r="10" fill="#c4b5fd" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Premium Action Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <a
              href="/"
              className="group flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Home
                size={20}
                className="mr-3 transition-transform group-hover:rotate-12"
              />
              <span className="text-lg font-medium">Return to Lobby</span>
            </a>
            <a
              href="/search"
              className="group flex items-center bg-white text-indigo-600 border-2 border-indigo-200 hover:border-indigo-300 py-4 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <Search
                size={20}
                className="mr-3 transition-transform group-hover:scale-110"
              />
              <span className="text-lg font-medium">Browse Accommodations</span>
            </a>
          </div>

          {/* Elegant Quick Links */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-medium text-gray-800 mb-6 text-center">
              Our Signature Experiences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <a
                href="/suites"
                className="group flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-indigo-50 text-center"
              >
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-xl mb-3 group-hover:shadow-md transition-all">
                  <Calendar
                    size={32}
                    className="text-indigo-600 transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="font-medium text-gray-700">Luxury Suites</span>
              </a>
              <a
                href="/dining"
                className="group flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-indigo-50 text-center"
              >
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-xl mb-3 group-hover:shadow-md transition-all">
                  <Map
                    size={32}
                    className="text-indigo-600 transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="font-medium text-gray-700">Fine Dining</span>
              </a>
              <a
                href="/spa"
                className="group flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-indigo-50 text-center"
              >
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-xl mb-3 group-hover:shadow-md transition-all">
                  <Sunset
                    size={32}
                    className="text-indigo-600 transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="font-medium text-gray-700">
                  Spa & Wellness
                </span>
              </a>
              <a
                href="/concierge"
                className="group flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-indigo-50 text-center"
              >
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-xl mb-3 group-hover:shadow-md transition-all">
                  <PhoneCall
                    size={32}
                    className="text-indigo-600 transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="font-medium text-gray-700">Concierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer with luxury branding */}
        <div className="mt-10 text-center">
          <p className="text-sm text-indigo-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-serif italic">Your Luxury Hotel</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
