import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { useAuth } from "../../Utils/AuthProvider.jsx";
import docimage from "/docimage.jpg";
import SliderImage from "./SliderImage.jsx";
import { FaArrowRightLong } from "react-icons/fa6";

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

  return (
    <div className="w-full pt-[16vh]">
      <div
        className={`fixed bottom-4 right-4 bg-gray-300 p-2 rounded-sm shadow-2xl ${
          visible ? "block" : "hidden"
        }`}
        onClick={scrolltotop}
      >
        <FaArrowUp />
      </div>
      <section className="py-10 px-4 md:py-20 w-full min-h-[88vh] flex items-center">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 mx-auto w-full max-w-7xl">
          {/* Left Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 leading-tight mb-6">
              Your Health, <span className="text-blue-500">Our Priority</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6 px-2 sm:px-0">
              Welcome to a smarter way to manage your health. Schedule
              appointments, track wellness, and get care from trusted
              professionals — All in one place.
            </p>
            <Link
              to={user ? "/bookappointment" : "/login"}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
            >
              {user ? (
                <div className="flex justify-center items-center gap-2">
                  Book Appointment Now
                  <FaArrowRightLong />
                </div>
              ) : (
                "Login to Book Appointment"
              )}
            </Link>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-center z-10">
            <img
              src={docimage}
              alt="Healthcare Illustration"
              className="w-[80%] sm:w-[60%] md:w-[30vw] max-w-xs md:max-w-none rounded-2xl shadow-lg shadow-red-400"
            />
          </div>
        </div>
      </section>

      <SliderImage />
    </div>
  );
};

export default Home;
