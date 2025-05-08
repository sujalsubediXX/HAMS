import { FaCalendarAlt, FaFilter, FaPlus } from "react-icons/fa";

const Appointments = () => {
  const appointments = [
    { id: 1, patient: "John Doe", date: "2025-05-07", time: "10:00 AM", type: "Consultation", status: "Confirmed" },
    { id: 2, patient: "Jane Smith", date: "2025-05-07", time: "11:30 AM", type: "Follow-up", status: "Pending" },
    { id: 3, patient: "Mike Johnson", date: "2025-05-08", time: "2:00 PM", type: "Check-up", status: "Confirmed" },
  ];

  return (
    <div className="w-[84vw] min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaCalendarAlt className="text-3xl" />
            <h1 className="text-2xl font-bold">Appointments</h1>
          </div>
          <button className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors">
            <FaPlus />
            <span>Schedule Appointment</span>
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-blue-600" />
            <select className="border rounded-md p-2 text-gray-700">
              <option>All Statuses</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <input
              type="date"
              className="border rounded-md p-2 text-gray-700"
              defaultValue="2025-05-07"
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3">Patient</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{appt.patient}</td>
                    <td className="p-3">{appt.date}</td>
                    <td className="p-3">{appt.time}</td>
                    <td className="p-3">{appt.type}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-sm ${
                          appt.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : appt.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;