import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Hotel,
  Calendar,
  Sliders,
  Users,
  Map,
  Star,
  Shield,
} from "lucide-react";

const LandingPage = () => {
  const [dynamicText, setDynamicText] = useState("relax");
  const [fadeIn, setFadeIn] = useState(true);
  const galleryRef = useRef(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);

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

    return () => clearInterval(interval);
  }, []);

  const handleFindOutMore = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      <motion.div
        className="min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg')",
          y: parallaxY,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

        <div className="relative z-10">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10">
            <motion.div
              className="max-w-lg text-center md:text-left text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-amber-500 text-sm font-bold uppercase mb-2 tracking-wider">
                Best Destinations in Nepal and Abroad
              </h1>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Travel, enjoy <br />
                and live a new <br />
                <motion.span
                  className="text-[#FFDF00] inline-block"
                  animate={{ opacity: fadeIn ? 1 : 0, y: fadeIn ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                >
                  {dynamicText} life
                </motion.span>
              </h2>
              <p className="mt-4 text-gray-200 text-lg">
                GHUMNA JAM provides unparalleled travel experiences in Nepal and
                beyond.
              </p>
              <motion.button
                className="mt-6 px-8 py-3 bg-[#FFDF00] text-black text-lg font-medium rounded-full hover:bg-amber-500 transition duration-300 shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255,223,0,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFindOutMore}
              >
                Find Out More
              </motion.button>
            </motion.div>
            <motion.div
              className="mt-10 md:mt-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg"
                alt="Mountains"
                className="rounded-2xl shadow-2xl w-full max-w-2xl mx-auto md:mx-0 transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </header>

          {/* Services Section */}
          <section className="py-16 bg-gradient-to-b from-transparent to-white/10">
            <motion.div
              className="text-center mb-12 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="uppercase text-sm tracking-widest text-gray-300">
                Category
              </h3>
              <h2 className="text-3xl md:text-4xl font-extrabold">
                We Offer Best Services
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
              {[
                {
                  to: "/hotel-bookings",
                  icon: <Hotel />,
                  title: "Best Hotels",
                  desc: "Luxury resorts to cozy boutique hotels.",
                },
                {
                  to: "/local-events",
                  icon: <Calendar />,
                  title: "Local Events",
                  desc: "Cultural festivals and exciting activities.",
                },
                {
                  to: "#",
                  icon: <Sliders />,
                  title: "Customization",
                  desc: "Tailored flight and event planning.",
                },
              ].map((service, index) => (
                <Link key={index} to={service.to} className="no-underline">
                  <motion.div
                    className="flex flex-col items-center bg-white bg-opacity-90 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="bg-white p-4 rounded-full shadow-md"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {React.cloneElement(service.icon, {
                        className: "h-10 w-10 text-amber-600",
                      })}
                    </motion.div>
                    <h3 className="text-lg font-bold mt-6 text-gray-800">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-center mt-4">
                      {service.desc}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </motion.div>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-amber-600 mb-4 flex justify-center">
                  {React.cloneElement(stat.icon, { className: "h-12 w-12" })}
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Featured Destinations
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
              >
                <motion.img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-80 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                  <motion.div
                    className="absolute bottom-0 p-6 text-white"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      {destination.name}
                    </h3>
                    <p className="mb-2">{destination.description}</p>
                    <p className="text-amber-500 font-semibold">
                      {destination.price}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-white" ref={galleryRef}>
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Discover Nepal's Beauty
          </motion.h2>
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
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-lg shadow-lg ${
                  index === 0 || index === 3
                    ? "md:col-span-2 md:row-span-2"
                    : ""
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <motion.img
                    src={image.url}
                    alt={image.title}
                    className="h-full w-full object-cover object-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <p className="text-white text-center font-semibold px-4">
                      {image.title}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#f1f1f1]">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 container mx-auto">
          {[
            {
              name: "Kshitij Adhikari",
              role: "Business Traveler",
              text: "The best hotel booking experience I've ever had.",
              rating: 5,
            },
            {
              name: "Safal Sharma",
              role: "Family Vacation",
              text: "Amazing deals for our family vacation.",
              rating: 5,
            },
            {
              name: "Kshitij Adhikari",
              role: "Solo Traveler",
              text: "Detailed information and verified reviews.",
              rating: 5,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden w-80"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
              }}
              viewport={{ once: true }}
            >
              <div className="bg-amber-600 h-20 flex items-center justify-center">
                <span className="text-5xl text-white font-bold">"</span>
              </div>
              <div className="p-6">
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-amber-500">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Subscribe to Our Newsletter
          </motion.h2>
          <motion.p
            className="text-white mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Stay updated with our latest travel deals, destination guides, and
            exclusive offers.
          </motion.p>
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <motion.button
                className="bg-gray-900 text-white px-6 py-3 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: "#1F2937" }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
