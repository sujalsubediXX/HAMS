import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaFilter } from "react-icons/fa";
import Fuse from "fuse.js";

const TotalAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchuser, setSearchdusers] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterdate, setfilterdate] = useState("");

  const fuse = new Fuse(appointments, {
    keys: ["doctorName", "patientName", "_id"],
    threshold: 0.3, // Adjust for fuzziness
    ignoreLocation: true,
    includeScore: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://hams-eegi.onrender.com/api/appointment/getappointmentdata");
        if (res.status === 200) {
          setAppointments(res.data.data);
         
        }
      } catch (error) {
        console.log("Error fetching appointment data");
      }
    })();
  }, []);

  const handleSearchUser = (e) => {
    setSearchdusers(e.target.value);
  };

  const searchedAppointments = searchuser
    ? fuse.search(searchuser).map((result) => result.item)
    : appointments;

  // Step 2: Date filter (if date is selected)
  const filteredAppointments = filterdate
    ? searchedAppointments.filter((appt) => {
        const apptDate = new Date(appt.date).toISOString().slice(0, 10); // 'YYYY-MM-DD'
        return apptDate === filterdate;
      })
    : searchedAppointments;

  const itemperpage = 8;
  const totalPages = Math.ceil(appointments.length / itemperpage);
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
    <div className="w-full mx-auto p-6 mt-4 my-4 bg-white shadow-md text-xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Admin Appointment Dashboard
      </h1>

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-[.8rem] text-gray-500" />
          <input
            type="text"
            placeholder="Search Appointments..."
            className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
            onChange={handleSearchUser}
            value={searchuser}
          />
        </div>
        <div className="flex gap-2 justify-center items-center">
          <span>
            <FaFilter className="text-blue-600 cursor-pointer text-xl" onClick={()=>{
              setfilterdate("")
              setSearchdusers("")}} />
          </span>
          <input
            type="date"
            name=""
            id=""
            className="rounded-xl px-2 py-1  border-2"
            onChange={(e) => setfilterdate(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-[18px] border">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-center border">SN.</th>

              <th className="p-3 text-center border">Doctor Name</th>
              <th className="p-3 text-center border">Specialty</th>
              <th className="p-3 text-center border">Appointment Date</th>
              <th className="p-3 text-center border">Time</th>
              <th className="p-3 text-center border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.slice(start, end).map((appt,index) => (
              <tr key={appt._id} className="hover:bg-gray-50 border-b">
                <td className="p-3 text-center border">{start+index+1}</td>

                <td className="p-3 text-center border">{appt.doctorName}</td>
                <td className="p-3 text-center border">
                  {appt.doctorSpecialty}
                </td>
                <td className="p-3 text-center border">
                  {appt.date.slice(0, 10)}
                </td>
                <td className="p-3 text-center border">
                  {appt.startTime}-{appt.endTime}
                </td>
                <td className="p-3 font-semibold border text-center ">
                  <span
                    className={`px-3 py-2 text-white font-bold rounded cursor-pointer ${
                      appt.status === "pending"
                        ? "bg-yellow-400"
                        : appt.status === "completed"
                        ? "bg-green-400"
                        : "bg-red-600"
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default TotalAppointments;
