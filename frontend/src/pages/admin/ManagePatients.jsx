import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchuser, setSearchdusers] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemperpage = 8;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/userdata");
        setPatients(res.data.data);
      } catch (error) {
        console.error(`Fetching doctor error: ${error.message}`);
      }
    };
    getUser();
  }, []);

  const handleSearchUser = (e) => {
    setSearchdusers(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredUsers = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchuser) ||
      patient.lastName.toLowerCase().includes(searchuser) ||
      patient.email.toLowerCase().includes(searchuser)
  );

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

  return (
    <div className="p-6 bg-gray-50 h-full w-[86vw] text-[18px]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Patient Management
      </h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-[.8rem] text-gray-500" />
          <input
            type="text"
            placeholder="Search Patients..."
            className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            onChange={handleSearchUser}
          />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-blue-100 text-gray-600">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Gender</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.slice(start, end).map((user, index) => (
              <tr key={user._id} className="text-center text-gray-700">
                <td className="p-2 border">{start + index + 1}</td>
                <td className="p-2 border">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.gender}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">
                  <span
                    className={`py-1 px-3 rounded-lg ${
                      user.isActive
                        ? "bg-green-400 text-white hover:bg-green-500"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {user.isActive ? "Active" : "Deactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1 className="text-3xl text-red-600 text-center">No patients found</h1>
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

export default ManagePatients;
