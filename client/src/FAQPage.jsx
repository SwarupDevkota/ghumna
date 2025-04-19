import React, { useState } from "react";
import AnimateOnScroll from "./ui/AnimateOnScroll";

const faqs = [
  {
    question: "What is Ghumna Jam?",
    answer:
      "Ghumna Jam is a platform that connects travelers to the best destinations, offering travel packages, event planning, and customized options for a seamless travel experience.",
  },
  {
    question: "How can I book a travel package?",
    answer:
      "You can book a travel package by visiting our website, exploring our destinations, and selecting the package that suits your needs. Once selected, proceed with the payment to confirm your booking.",
  },
  {
    question: "Do you provide international travel services?",
    answer:
      "Yes, we offer travel services for both domestic and international destinations, focusing on quality and affordability.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods, including credit/debit cards, PayPal, and direct bank transfers.",
  },
  {
    question: "Can I customize my travel package?",
    answer:
      "Absolutely! We provide flexible options to customize travel packages, including selecting specific destinations, activities, and accommodations.",
  },
  {
    question: "Do you offer group discounts?",
    answer:
      "Yes, we offer special discounts for group bookings. Please contact our support team for more details.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Our cancellation policy varies depending on the package and service provider. Please check the terms and conditions for the specific package you choose.",
  },
  {
    question: "Are your travel guides certified?",
    answer:
      "Yes, all our travel guides are experienced professionals who are certified and well-versed in the local culture and destinations.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach out to our customer support team via email at contact@ghumnajam.com or call us at +1 (123) 456-7890.",
  },
  {
    question: "Do you provide travel insurance?",
    answer:
      "Yes, we provide travel insurance options to ensure your safety and peace of mind during your trips. You can add this option while booking your package.",
  },
  {
    question: "Can I gift a travel package to someone?",
    answer:
      "Yes, we offer gift cards and options to book packages on behalf of others. It's a great way to surprise your loved ones with a memorable experience.",
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle the dropdown
  };

  return (
    <>
      {/* Hero Section with Mountain Walking Video */}
      <div className="relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[500px] object-cover"
        >
          {/* Primary Video Source */}
          <source
            src="https://www.videvo.net/videvo_files/video/free/2019-02/small_watermarked/181015_07_Hotel%20View%20HD_10_preview.webm"
            type="video/webm"
          />
          {/* Fallback Message */}
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-center">
          <AnimateOnScroll animateIn="fade-in">
            <div className="px-6 py-8 rounded-xl bg-black bg-opacity-40 backdrop-blur-sm">
              <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-600">
                Travel & Stay FAQ
              </h1>
              <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-yellow-300 to-amber-500 rounded-full"></div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF1D0] py-16 px-6 md:px-20">
        {/* Page Header */}
        <AnimateOnScroll animateIn="slide-up">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-yellow-100 mb-4">
              <h3 className="uppercase text-sm tracking-wide font-bold text-amber-600">
                FAQs
              </h3>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
              Find answers to the most commonly asked questions about our
              services and make your travel planning smoother.
            </p>
            <div className="mt-6 h-1 w-24 mx-auto bg-amber-400 rounded-full"></div>
          </div>
        </AnimateOnScroll>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <AnimateOnScroll
              key={index}
              animateIn="slide-up"
              delay={index * 100}
            >
              <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl border-l-4 border-amber-400">
                {/* Question */}
                <div
                  className={`flex justify-between items-center p-5 cursor-pointer transition-all ${
                    activeIndex === index
                      ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                      : "bg-white hover:bg-yellow-50"
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <span className="mr-3 text-amber-600 text-xl">Q:</span>
                    {faq.question}
                  </h3>
                  <span className="text-gray-800 text-2xl bg-white bg-opacity-70 h-8 w-8 flex items-center justify-center rounded-full">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </div>

                {/* Answer */}
                {activeIndex === index && (
                  <div className="p-5 bg-white text-gray-700 border-t border-gray-100">
                    <div className="flex">
                      <span className="mr-3 text-amber-600 font-bold">A:</span>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Additional Decoration */}
        <AnimateOnScroll animateIn="fade-in">
          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
              Still Have Questions? Contact Us
            </button>
            <p className="mt-6 text-gray-600">
              Our customer support team is available 24/7 to assist you
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </>
  );
};

export default FAQPage;
