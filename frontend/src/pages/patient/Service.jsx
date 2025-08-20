
import React from "react";
import { FaCalendarCheck, FaUserMd, FaFileMedical, FaShieldAlt } from "react-icons/fa";

const services = [
  {
    icon: <FaCalendarCheck size={32} className="text-blue-700" />,
    title: "Appointment Booking",
    description: "Patients can book, reschedule, and cancel appointments with ease.",
  },
  {
    icon: <FaUserMd size={32} className="text-blue-700" />,
    title: "Doctor Management",
    description: "Doctors manage their availability, patient list, and appointments efficiently.",
  },
  {
    icon: <FaFileMedical size={32} className="text-blue-700" />,
    title: "Medical History",
    description: "Patients can view and manage their past diagnoses, prescriptions, and reports.",
  },
  {
    icon: <FaShieldAlt size={32} className="text-blue-700" />,
    title: "Secure Access",
    description: "Role-based access for Admins, Doctors, and Patients ensures data security.",
  },
];

const Service = () => {
  return (
    <section className="bg-gray-50 py-12 px-6 md:px-16 rounded-2xl shadow-md mt-6 pt-[20vh]">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-blue-900">Our Services</h2>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          HAMS offers a comprehensive suite of services to simplify healthcare administration and improve patient experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-4">
              <div>{service.icon}</div>
              <div>
                <h4 className="text-xl font-semibold text-blue-800">{service.title}</h4>
                <p className="text-gray-600 mt-1">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Service;
