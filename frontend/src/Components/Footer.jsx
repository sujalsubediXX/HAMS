import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 mt-4 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo and description */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600">HAMs</h2>
            <p className="mt-2 text-[18px] text-gray-600">
              Your trusted partner for easy and efficient healthcare
              appointments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 cursor-pointer">Quick Links</h3>
            <ul className="space-y-2 text-[17px]">
              <li>
                <Link to="/" className="hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              
              <li>
                <Link to="/service" className="hover:text-blue-600 transition">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Services</h3>
            <ul className="space-y-2 text-[17px]">
              <li>
                <Link to="#" className="hover:text-blue-600 transition">
                  Doctor Booking
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-blue-600 transition">
                  Medical History
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact</h3>
            <p className="text-[17px] text-gray-600">Email: support@hams.com</p>
            <p className="text-[17px] text-gray-600">Phone: 977 9812821234</p>
            <p className="text-[17px] text-gray-600">Location: Kathmandu, Nepal</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-[17px] text-gray-500 text-center cursor-pointer">
          © {new Date().getFullYear()} HAMs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
