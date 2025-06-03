import React from "react";
import { FaUsers, FaSearch } from "react-icons/fa";
const DoctorTopBar = () => {
  return (
 
    <div className="bg-blue-400 text-white p-6 flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-3xl" />
            <h1 className="text-2xl font-bold">My Patients</h1>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 rounded-md text-gray-800 bg-white"
            />
          </div>
        </div>
  );
};

export default DoctorTopBar;
