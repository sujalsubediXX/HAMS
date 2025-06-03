// src/components/About.jsx
import React from "react";
import { FaLightbulb, FaBullseye, FaTools } from "react-icons/fa";

const About = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-16 rounded-2xl shadow-md mt-6 pt-[20vh]">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-900">About HAMS</h2>
        <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
          The Healthcare Appointment Management System (HAMS) is a modern platform built to streamline doctor-patient interactions. Whether you're a patient looking to book a consultation, or a doctor managing appointments, HAMS brings efficiency, clarity, and care to healthcare scheduling.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center mt-10">
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <FaLightbulb size={32} className="text-blue-700 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-blue-800">Our Vision</h3>
          <p className="text-gray-600 mt-2">
            To make healthcare access simpler and smarter for every patient, while supporting doctors with seamless appointment management.
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <FaBullseye size={32} className="text-blue-700 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-blue-800">Our Mission</h3>
          <p className="text-gray-600 mt-2">
            Deliver an intuitive digital solution that prioritizes patient well-being and professional healthcare service delivery.
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <FaTools size={32} className="text-blue-700 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-blue-800">Built With</h3>
          <p className="text-gray-600 mt-2">
            MERN Stack (MongoDB, Express.js, React, Node.js) with a focus on scalability, security, and ease of use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
