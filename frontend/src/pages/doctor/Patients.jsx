import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../Utils/AuthProvider";

const Patients = () => {
  const { user } = useAuth();
  const [patient, setPatientData] = useState([]);
  const [inputdata, setInputData] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 8;

  useEffect(() => {
    const fetchPatientData = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(
            "/api/appointment/patients-by-doctor-email",
            {
              params: { email: user.email },
            }
          );
          if (res.status === 200) {
            setPatientData(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching patient data:", err);
        }
      }
    };
    fetchPatientData();
  }, [user]);

  // Filtered patients based on search
  const filteredPatients = patient.filter((data) => {
    const search = inputdata.toLowerCase();
    return (
      `${data.firstName} ${data.lastName}`.toLowerCase().includes(search) ||
      data.email.toLowerCase().includes(search) ||
      data.gender.toLowerCase().includes(search)
    );
  });

  // Pagination logic
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

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
    <div className="h-[88vh] w-full bg-gray-100">
      <div className="mx-auto h-full bg-white">
        <div className="p-6 border-b border-gray-200 flex justify-start items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              onChange={(e) => setInputData(e.target.value)}
              className="pl-10 pr-4 py-2 border-[1px] rounded-md text-gray-800 bg-white"
            />
          </div>
        </div>

        {/* Patients Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th>SN.</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">IsActive</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient, index) => (
                  <tr
                    key={patient.id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{indexOfFirst + index + 1}</td>
                    <td className="p-3">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="p-3">{patient.email}</td>
                    <td className="p-3">{patient.age}</td>
                    <td className="p-3">{patient.phone}</td>
                    <td className="p-3">
                      {patient.gender.charAt(0).toUpperCase() +
                        patient.gender.slice(1)}
                    </td>
                    <td className="p-3 text-white font-medium ">
                      <span
                        className={`py-1 px-3 rounded-lg ${
                          patient.isActive
                            ? "bg-green-400 text-white hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {patient.isActive ? "Active" : "Deactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
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
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
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
      </div>
    </div>
  );
};

export default Patients;
