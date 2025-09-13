import { FaFilter } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../Utils/AuthProvider";
import toast from "react-hot-toast";

const Appointments = () => {
  const { user ,userData} = useAuth();
  const [doctordata, setDoctordata] = useState({});
  const [appointmentdata, setAppointmentdata] = useState([]);
  const [medicaldata, setMedicaldata] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selecteduser, setSelecteduser] = useState({});
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [remarks, setRemarks] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [currentpage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    if (user?.role) {
      setDoctordata(userData)
    } else {
      setDoctordata({}); 
    }
  }, [user,userData]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (doctordata?._id) {
        try {
          const res = await axios.get(`https://hams-7zpe.onrender.com/api/appointment/getappointment?doctorID=${doctordata._id}`);
          if (res.status === 200) {
            setAppointmentdata(res.data.appointment);
          }
        } catch (err) {
          console.error("Error fetching appointment data:", err);
        }
      }
    };
    fetchAppointments();
  }, [doctordata, isModalOpen]);

  // Fetch medical records
  useEffect(() => {
    const fetchMedicalData = async () => {
      if (doctordata?._id) {
        try {
          const res = await axios.get(`https://hams-7zpe.onrender.com/api/medicalhistory/getMedicalhistory?doctorID=${doctordata._id}`);
          if (res.status === 200) {
          
            setMedicaldata(res.data.data);
          }
        } catch (err) {
         
          console.error("Error fetching medical data:", err);
        }
      }
    };
    fetchMedicalData();
  }, [doctordata, isModalOpen]);

  // Submit/Update medical info
  const handleMedicalSubmit = async () => {
    if (!diagnosis || !treatment || !selecteduser || !remarks) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const isUpdating = selecteduser.status === "completed";
      const endpoint = isUpdating
        ? "https://hams-7zpe.onrender.com/api/medicalhistory/updateMedicalData"
        : "https://hams-7zpe.onrender.com/api/medicalhistory/insertMedicalData";

      const payload = {
        patientID: selecteduser.patientID,
        doctorID: selecteduser.doctorID,
        doctorName: selecteduser.doctorName,
        diagnosis,
        treatment,
        remarks,
        appointmentId: selecteduser._id,
      };

      const res = await axios[isUpdating ? "put" : "post"](endpoint, payload);

      if (res.status === 200) {
        toast.success(`Medical data ${isUpdating ? "updated" : "added"} successfully`);
        setIsModalOpen(false);
        setDiagnosis("");
        setTreatment("");
        setRemarks("");
      } else {
        toast.error("Failed to submit medical data");
      }
    } catch (err) {
      if (err.response.status === 404) {
        alert(err.response.message);
      }
      toast.error("Error submitting medical data");
    }
  };

  // Filters
  const filteredAppointments = appointmentdata.filter((appt) => {
    const matchStatus = filterStatus === "all" || appt.status.toLowerCase() === filterStatus;
    const matchDate = !filterDate || new Date(appt.date).toISOString().split("T")[0] === filterDate;
    return matchStatus && matchDate;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const start = (currentpage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // Pagination handlers
  const handlePageChange = (pageNum) => setCurrentPage(pageNum);
  const handleNext = () => currentpage < totalPages && setCurrentPage(currentpage + 1);
  const handlePrev = () => currentpage > 1 && setCurrentPage(currentpage - 1);

  return (
    <div className="w-full h-[88vh] overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200 flex flex-row-reverse items-center">
        <div className="flex items-center space-x-4">
          <FaFilter className="text-blue-600" />
          <select
            className="border rounded-md p-2 text-gray-700"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            className="border rounded-md p-2 text-gray-700"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-blue-100 text-gray-600">
            <tr >
              <th className="p-3 border">SN.</th>
              <th className="p-3 border">Patient Name</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.slice(start, end).map((appt, index) => {
              const matchedMedical = medicaldata.find(
                (record) =>
                  record.patientID === appt.patientId &&
                  record.doctorID === appt.doctorId
              );

              return (
                <tr key={appt._id} className="text-center text-gray-700">
                  <td className="p-3 border">{start + index + 1}</td>
                  <td className="p-3 border">{appt.patientName}</td>
                  <td className="p-3 border">{new Date(appt.date).toISOString().split("T")[0]}</td>
                  <td className="p-3 border">{appt.startTime}-{appt.endTime}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-md text-sm ${
                        appt.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appt.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {appt.status === "cancelled" ? (
                      <span className="text-gray-400">Cancelled</span>
                    ) : (
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                  
                          setSelecteduser({
                            doctorID: appt.doctorId,
                            patientID: appt.patientId,
                            doctorName: appt.doctorName,
                            _id: appt._id,
                            status: appt.status,
                          });
                          setDiagnosis(matchedMedical?.diagnosis || "");
                          setTreatment(matchedMedical?.treatment || "");
                          setRemarks(matchedMedical?.remarks || "");
                          setIsModalOpen(true);
                        }}
                      >
                        {appt.status === "pending" ? "View" : "Update"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center space-x-2 items-center">
          <button
            onClick={handlePrev}
            disabled={currentpage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentpage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentpage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000096] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {selecteduser?.status === "completed" ? "Update Medical Info" : "Enter Medical Info"}
            </h2>
            <div className="mb-3">
              <label className="block mb-1">Diagnosis:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Treatment:</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Remarks:</label>
              <textarea
                type="text"
                className="w-full p-2 border rounded"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setDiagnosis("");
                  setTreatment("");
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleMedicalSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {selecteduser?.status === "completed" ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
