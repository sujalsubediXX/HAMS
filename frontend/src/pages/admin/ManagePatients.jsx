import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import Fuse from "fuse.js";
import axios from "axios";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectGender, setSelectGender] = useState("");
  const [selectStatus, setSelectStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 8;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/api/user/userdata");
        setPatients(res.data.data);
      } catch (error) {
        console.error(`Fetching patient error: ${error.message}`);
      }
    };
    getUser();
  }, []);

  const handleSearchUser = (e) => {
    setSearchUser(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const fuse = new Fuse(patients, {
    keys: ["firstName", "lastName", "email"],
    threshold: 0.4,
  });

  const filteredData = searchUser
    ? fuse.search(searchUser).map((result) => result.item)
    : patients;

  const filteredByGender =
    selectGender && selectGender !== "all"
      ? filteredData.filter(
          (data) => data.gender.toLowerCase() === selectGender
        )
      : filteredData;

  const filteredUsers =
    selectStatus && selectStatus !== "all"
      ? filteredByGender.filter((data) =>
          selectStatus === "active" ? data.isActive : !data.isActive
        )
      : filteredByGender;

  const totalPages = Math.ceil(filteredUsers.length / itemPerPage);
  const start = (currentPage - 1) * itemPerPage;
  const end = start + itemPerPage;

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

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-[.8rem] text-gray-500" />
          <input
            type="text"
            placeholder="Search Patients..."
            className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            onChange={handleSearchUser}
            value={searchUser}
          />
        </div>

        <div className="flex gap-2 items-center">
          <span>
            <FaFilter
              className="text-blue-600 cursor-pointer text-xl"
              onClick={() => {
                setSelectGender("");
                setSelectStatus("");
                setSearchUser("");
              }}
            />
          </span>
          <select
            className="bg-white border-2 px-2 py-1 rounded-lg"
            onChange={(e) => setSelectGender(e.target.value)}
          >
            <option value="all">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            className="bg-white border-2 px-2 py-1 rounded-lg"
            onChange={(e) => setSelectStatus(e.target.value)}
          >
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length > 0 ? (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-blue-100 text-gray-600">
            <tr>
              <th className="p-3 border">SN .</th>
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
                        : "bg-red-500 text-white hover:bg-red-600"
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

      {/* Pagination */}
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
