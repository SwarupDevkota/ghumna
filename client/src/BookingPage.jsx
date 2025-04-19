import React from "react";
import "./styles.css"; // Ensure Tailwind CSS is properly configured
import { MapPin, CreditCard, Calendar, Users } from "lucide-react"; // Lucide React icons

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-image-joinUs bg-cover bg-center py-10 px-6 md:px-20 relative">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Content Section */}
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center md:text-left mb-12 text-white">
          <h3 className="uppercase text-sm tracking-wide font-bold text-[#FFD700]">
            Easy and Fast
          </h3>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Book Your Next Trip <br /> In 3 Easy Steps
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Steps Section */}
          <div className="flex-1 space-y-10">
            {/* Step 1 */}
            <div className="flex items-start gap-6">
              <div className="bg-[#FFD700] text-white p-4 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Choose Hotel
                </h3>
                <p className="text-gray-200">
                  Select the best hotel in  destination from our curated list of top
                  travel spots.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6">
              <div className="bg-[#FFB800] text-white p-4 rounded-full">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Make Payment</h3>
                <p className="text-gray-200">
                  Securely pay for your trip using our trusted payment gateways.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6">
              <div className="bg-[#FFC700] text-white p-4 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Reach Airport on Selected Date
                </h3>
                <p className="text-gray-200">
                  Reach hotel on the selected date and enjoy your trip!
                </p>
              </div>
            </div>
          </div>

          {/* Featured Trip Section */}
          <div className="flex-1 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Trip to Everest Base Camp
            </h3>
            <p className="text-gray-600 mb-4">
              Experience the thrill of trekking to the iconic Everest Base Camp
              with a group of like-minded adventurers.
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div>
                <p className="font-bold text-gray-800">14-29 June</p>
                <p>by ABC Group</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>24 people going</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button className="bg-[#FFD700] text-black px-4 py-2 rounded-lg shadow hover:bg-[#FFC700]">
                Book Now
              </button>
              <span className="text-gray-500 text-sm">Ongoing</span>
            </div>
          </div>
        </div>

        {/* Additional Trips Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-6">Other Trips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trip Card 1 */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
              <h4 className="font-bold text-lg text-gray-800 mb-2">
                Trip to Annapurna Circuit
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Explore the stunning Annapurna region with experienced guides.
              </p>
              <div className="text-gray-600 text-sm mb-4">
                <p>20-30 July</p>
                <p>by XYZ Group</p>
              </div>
              <button className="bg-[#FFC700] text-black px-4 py-2 rounded-lg hover:bg-[#FFB800]">
                Learn More
              </button>
            </div>

            {/* Trip Card 2 */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
              <h4 className="font-bold text-lg text-gray-800 mb-2">
                Trip to Langtang Valley
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Discover the picturesque Langtang Valley and its unique culture.
              </p>
              <div className="text-gray-600 text-sm mb-4">
                <p>5-15 August</p>
                <p>by Adventure Co.</p>
              </div>
              <button className="bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-[#FFC700]">
                Learn More
              </button>
            </div>

            {/* Trip Card 3 */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
              <h4 className="font-bold text-lg text-gray-800 mb-2">
                Trip to Pokhara
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Relax by the serene lakes and enjoy the peaceful city of
                Pokhara.
              </p>
              <div className="text-gray-600 text-sm mb-4">
                <p>10-15 September</p>
                <p>by Nepal Treks</p>
              </div>
              <button className="bg-[#FFC700] text-black px-4 py-2 rounded-lg hover:bg-[#FFD700]">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
