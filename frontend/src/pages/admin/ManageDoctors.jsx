import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Fuse from "fuse.js";
const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchdoctor, setSearchdoctors] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // MUI starts from 1
const getUser = async () => {
      try {
        const res = await axios.get("https://hams-7zpe.onrender.com/api/doctor/doctordata");
        setDoctors(res.data.data);
      } catch (error) {
        toast.error("Backend server not started or crashed.");
        console.error(`Fetching doctor error: ${error.message}`);
      }
    };
  useEffect(() => {
    getUser();
  }, []);

  const handleSearcDoctor = (e) => {
    setSearchdoctors(e.target.value.toLowerCase());
  };

  const fuse = new Fuse(doctors, {
    keys: ["name", "email"],
    threshold: 0.3,
    ignoreLocation: true,
  });
  const filteredUsers = searchdoctor
    ? fuse.search(searchdoctor).map((data) => data.item)
    : doctors;
  const itemperpage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemperpage);
  const start = (currentPage - 1) * itemperpage;
  const end = start + itemperpage;

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
const handledelete = async (id) => {
  
  try {
    const res = await axios.delete("https://hams-7zpe.onrender.com/api/doctor/deleteaccount", {
      data: { id: id }, 
    });

    if (res.status === 201) {
      toast.success("Doctor account was deleted Successfully.");
      getUser();
    } else {
      toast.error("Account not deleted.");
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    toast.error("Account not deleted.");
  }
};


  return (
    <div className="p-6 bg-gray-50 h-[100vh] w-[86vw] text-[18px]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Doctor Management
      </h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-[.8rem] text-gray-500" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            onChange={handleSearcDoctor}
          />
        </div>
        <Link
          to="/adddoctor"
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
        >
          Add Doctor
        </Link>
      </div>
      {filteredUsers.length > 0 ? (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-blue-100 text-gray-600">
            <tr>
              <th className="p-3 border">SN .</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Gender</th>
              <th className="p-3 border">Specialization</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.slice(start, end).map((user, index) => (
        
              <tr key={user._id} className="text-center text-gray-700">
                <td className="p-2 border">{start+index + 1}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.gender}</td>
                <td className="p-2 border">{user.specialization}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">
                  <span
                    className={`py-1 px-3 rounded-lg ${
                      user.isActive
                        ? "bg-green-400 text-white hover:bg-green-500"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {user.isActive ? "Active" : "Deactive"}
                  </span>
                </td>
                <td className="p-2 border">
                  {
                    user.isActive?<button
                    onClick={() => handledelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>: <button className="bg-yellow-400 px-3 py-1 rounded-md" disabled title="Already deactivated">Deleted</button>
                  }
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1 className="text-3xl text-red-600 text-center">No Doctor founds</h1>
      )}
      <div className="mt-4 flex justify-center space-x-2 items-center">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageDoctors;
