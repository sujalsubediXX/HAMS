
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowUp, FaHeartbeat, FaCalendarCheck, FaUserMd } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../../Utils/AuthProvider.jsx";
import docimage from "/docimage.jpg";
import SliderImage from "./SliderImage.jsx";
import { motion } from "framer-motion";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrolltotop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const features = [
    {
      icon: <FaHeartbeat className="text-4xl text-blue-500" />,
      title: "Health Care",
      description: "Get personalized insights"
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-blue-500" />,
      title: "Easy Scheduling",
      description: "Book appointments with just a few clicks"
    },
    {
      icon: <FaUserMd className="text-4xl text-blue-500" />,
      title: "Expert Doctors",
      description: "Connect with qualified healthcare professionals"
    }
  ];

  return (
    <div className="w-full pt-[12vh] ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed bottom-4 right-4 bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ${
          visible ? "block" : "hidden"
        }`}
        onClick={scrolltotop}
      >
        <FaArrowUp className="text-white" />
      </motion.div>

      <section className="py-8 px-4 md:py-16 w-full min-h-[88vh] flex items-center">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 mx-auto w-full max-w-7xl">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-800 leading-tight mb-6">
              Your Health,{" "}
              <span className="text-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text ">
                Our Priority
              </span>
            </h1>

            <p className="text-gray-600 text-lg sm:text-xl mb-8 px-2 sm:px-0 leading-relaxed">
              Welcome to a smarter way to manage your health. Schedule
              appointments, track wellness, and get care from trusted
              professionals — All in one place.
            </p>

            {user?.role != "Doctor" && user?.role != "Admin" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={user ? "/bookappointment" : "/login"}
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 text-lg font-semibold"
                >
                  {user ? (
                    <div className="flex justify-center items-center gap-3">
                      Book Appointment Now
                      <FaArrowRightLong className="animate-pulse" />
                    </div>
                  ) : (
                    "Login to Book Appointment"
                  )}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex justify-center z-10"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-200 rounded-2xl blur-xl opacity-50"></div>
              <img
                src={docimage}
                alt="Healthcare Illustration"
                className="w-[80%] sm:w-[60%] md:w-[30vw] max-w-xs md:max-w-none rounded-2xl  shadow-red-400 shadow-xl relative z-10 transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-16"
          >
            Why Choose Us?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-blue-50 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SliderImage />
    </div>
  );
};

export default Home;
